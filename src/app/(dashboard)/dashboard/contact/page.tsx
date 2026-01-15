import { updateContactInfo } from "@/app/(dashboard)/dashboard/contact/_actions";
import { prisma } from "@/lib/prisma";
import ContactPageClient from "@/modules/dashboard/contact/main";
import { cacheTag } from "next/cache";
import React from "react";

const ContactPage = async () => {
  "use cache";
  cacheTag("contact");
  const getContactDetail = async () => {
    return await prisma.contact.findFirst();
  };

  const contact = await getContactDetail();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contact Information
        </h1>
        <p className="text-muted-foreground">
          Update your contact details displayed on the contact and about pages
        </p>
      </div>

      <ContactPageClient
        contactInfo={contact}
        updateContactInfo={updateContactInfo}
      />
    </div>
  );
};

export default ContactPage;
