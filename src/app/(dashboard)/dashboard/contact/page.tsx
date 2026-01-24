import { prisma } from "@/lib/prisma";
import ContactPageClient from "@/modules/dashboard/contact";
import { cacheTag } from "next/cache";

const ContactPage = async () => {
  const getContactDetail = async () => {
    "use cache";
    cacheTag("contact");
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

      <ContactPageClient contactInfo={contact} />
    </div>
  );
};

export default ContactPage;
