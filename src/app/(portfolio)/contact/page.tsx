export const dynamic = "force-static";
import { prisma } from "@/lib/prisma";
import { ContactPageClient } from "@/modules/contact/main";
import { ContactSchemaDTO } from "@/schema/contact.schema";

export default async function Contact() {
  const getContactDetail = async () => {
    return await prisma.contact.findFirst();
  };

  const contact = await getContactDetail();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[87vh]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? Let's discuss how we can work together.
          </p>
        </div>

        <ContactPageClient contact={contact as ContactSchemaDTO} />
      </div>
    </div>
  );
}
