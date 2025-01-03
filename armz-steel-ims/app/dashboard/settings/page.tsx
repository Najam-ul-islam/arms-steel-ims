"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const settingsFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  currency: z.string().min(1, "Please select a currency"),
  lowStockThreshold: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    z.number().min(0, "Threshold must be positive")
  ),
  notifications: z.boolean(),
  address: z.string().optional(),
});

const currencies = [{ label: "PKR", value: "PKR" }];

interface SystemInfo {
  version: string;
  lastBackup: string;
  dbSize: string;
  totalUsers: number;
}

export default function SettingsPage() {
  const { toast } = useToast();

  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: "1.0.0",
    lastBackup: "Never",
    dbSize: "Unknown",
    totalUsers: 0,
  });

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      companyName: "", // Ensure this is an empty string or a default value
      email: "", // Same for email
      currency: "", // Default to an empty string or a valid currency value
      lowStockThreshold: 0, // Ensure this is a number (0 is safe)
      notifications: false, // Default boolean
      address: "", // Default empty string
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch and set system info from localStorage
      const savedInfo = localStorage.getItem("systemInfo");
      if (savedInfo) {
        setSystemInfo(JSON.parse(savedInfo));
      }

      // Set form default values from localStorage, ensuring fallback to safe defaults
      const savedForm = localStorage.getItem("settingsForm");
      if (savedForm) {
        form.reset(JSON.parse(savedForm));
      } else {
        // If no saved form, reset to default values (already handled by useForm defaults)
        form.reset({
          companyName: "",
          email: "",
          currency: "",
          lowStockThreshold: 0,
          notifications: false,
          address: "",
        });
      }
    }
  }, [form]);

  async function onSubmit(data: z.infer<typeof settingsFormSchema>) {
    try {
      if (typeof window !== "undefined") {
        // Save settings form data to localStorage
        localStorage.setItem("settingsForm", JSON.stringify(data));

        // Trigger success notification
        toast({
          title: "Settings Saved",
          description: "Your changes have been saved successfully.",
          variant: "default", // optional, depending on your toast implementation
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  }


  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        {/* <Button type="submit" form="settings-form">
          Save Changes
        </Button> */}
        <Button
          type="submit"
          form="settings-form"
          onClick={() => {
            form.handleSubmit(onSubmit)();
          }}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="settings-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""} // Ensure the value is controlled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Version
              </h4>
              <p className="text-sm">{systemInfo.version}</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Last Backup
              </h4>
              <p className="text-sm">{systemInfo.lastBackup}</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Database Size
              </h4>
              <p className="text-sm">{systemInfo.dbSize}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
