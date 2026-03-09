import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Wallet, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentMember } from "@/hooks/use-current-member";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getInitials } from "@/lib/utils";
import { AVATAR_COLORS, type FamilyMember, type InsertFamilyMember } from "@shared/schema";

const loginFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  income: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setCurrentMember } = useCurrentMember();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const { data: members = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      name: "",
      income: "",
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertFamilyMember) =>
      apiRequest<FamilyMember>('POST', '/api/family-members', data),
    onSuccess: (newMember) => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-members'] });
      setCurrentMember(newMember);
      toast({
        title: "Welcome!",
        description: `${newMember.name}, you're all set to track expenses.`,
      });
      setLocation("/");
    },
  });

  const handleLogin = (member: FamilyMember) => {
    setCurrentMember(member);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${member.name}`,
    });
    setLocation("/");
  };

  const onSubmit = (values: LoginFormValues) => {
    const income = values.income ? parseFloat(values.income) : 0;
    createMemberMutation.mutate({
      name: values.name,
      income: income.toString(),
      avatarColor: selectedColor,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Family Expense Tracker</CardTitle>
          <CardDescription>
            {isRegistering ? "Create your profile to get started" : "Welcome back! Select your profile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRegistering && members.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Existing Members</p>
              <div className="grid gap-2">
                {members.map((member) => (
                  <Button
                    key={member.id}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => handleLogin(member)}
                    data-testid={`button-login-${member.id}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback style={{ backgroundColor: member.avatarColor }}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{member.name}</p>
                      {parseFloat(member.income || "0") > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Income: ${parseFloat(member.income || "0").toFixed(2)}
                        </p>
                      )}
                    </div>
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isRegistering ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Avatar Color</FormLabel>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full transition-transform ${
                          selectedColor === color ? "ring-2 ring-primary ring-offset-2 scale-110" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`button-color-${color}`}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Income (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-income"
                        />
                      </FormControl>
                      <FormDescription>
                        Used to calculate budget vs spending
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRegistering(false)}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMemberMutation.isPending}
                    data-testid="button-register"
                  >
                    {createMemberMutation.isPending ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={() => setIsRegistering(true)}
              data-testid="button-show-register"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
