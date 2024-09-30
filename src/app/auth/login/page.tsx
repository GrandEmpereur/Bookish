// pages/auth/login.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/services/authService';
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  remember_me: z.boolean(),
});

const Login = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [remember_me, setRememberMe] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await login(values.email, values.password, remember_me);
      router.push('/feed');
    } catch (error) {
      const errorMessage = (error as { message: string }).message || 'Une erreur est survenue';
      setLoginError(errorMessage);
      form.reset();
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen text-foreground px-5 md:px-8 lg:px-12">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-8 lg:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">Connectez-vous
              à votre compte</h1>
            <p className="text-center text-muted-foreground mb-6">Veuillez vous connecter pour continuer</p>
            {loginError && <p className="text-error text-center">{loginError}</p>}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} className='text-[16px]' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">

                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        className='text-[16px]'
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>

                      <div className="items-end flex pt-5 gap-x-2">
                        <Checkbox id="terms1" onCheckedChange={handleRememberMeChange} />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Ce souvenir de moi
                          </label>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-end">
              <p>
                <Link href="/auth/forgot-password" className="text-secondary text-sm">
                  Mot de passe oublié ?
                </Link>
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground py-3 md:py-4 lg:py-5">
              Se connecter
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className=''>
            Vous n'avez pas de compte ?{' '}
            <Link href="/auth/register" className="text-secondary">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
