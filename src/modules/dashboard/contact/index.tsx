"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SaveContact } from "@/modules/dashboard/contact/forms/save-contact";
import { Contact } from "@prisma/client";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

type Props = {
  contactInfo: Contact | null;
};

const ContactPageClient = ({ contactInfo }: Props) => {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            These details will be displayed on your contact and about pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SaveContact contact={contactInfo} />
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
