"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactSchema } from "@/schema/contact.schema";
import { useConfirmModal } from "@/hooks/use-confirm";
import { useCustomAction } from "@/hooks/use-custom-action";
import { ServerActionState } from "@/types/common.types";
import { Contact } from "@prisma/client";
import {
  IconDeviceFloppy,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  contactInfo: Contact | null;
  updateContactInfo: (data: ContactSchema) => Promise<ServerActionState<null>>;
};

const ContactPageClient = ({ contactInfo, updateContactInfo }: Props) => {
  const [newContactInfo, setNewContactInfo] = useState<ContactSchema>({
    email: contactInfo?.email ?? "",
    phone: contactInfo?.phone ?? "",
    location: contactInfo?.location ?? "",
  });

  const { execute, isLoading } = useCustomAction(updateContactInfo, {
    onSuccess(message) {
      toast.success(message);
    },
    onError(message) {
      toast.error(message);
    },
  });

  const { confirmAction } = useConfirmModal();

  const submit = () => {
    // const serverFn = execute({ ...contactInfo!, ...newContactInfo });
    confirmAction(
      () => execute({ ...contactInfo!, ...newContactInfo }),
      "Please confirm: Do you want to update the contact info?"
    );
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            These details will be displayed on your contact and about pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <IconMail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={newContactInfo?.email}
              onChange={(e) =>
                setNewContactInfo({ ...newContactInfo, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <IconPhone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={newContactInfo?.phone}
              onChange={(e) =>
                setNewContactInfo({ ...newContactInfo, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              value={newContactInfo?.location}
              onChange={(e) =>
                setNewContactInfo({
                  ...newContactInfo,
                  location: e.target.value,
                })
              }
            />
          </div>

          <Button onClick={() => submit()} disabled={isLoading}>
            <IconDeviceFloppy className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How your contact information will appear on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconMail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconPhone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconMapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo?.location || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPageClient;
