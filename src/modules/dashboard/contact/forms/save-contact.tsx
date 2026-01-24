import { updateContactInfoAction } from "@/app/(dashboard)/dashboard/contact/_actions";
import { useConfirm } from "@/components/confirm-context";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import {
  ContactSchema,
  contactSchema,
  contactSchemaDTO,
  ContactSchemaDTO,
} from "@/schema/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconDeviceFloppy,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  contact: ContactSchemaDTO | null;
};

export const SaveContact = ({ contact }: Props) => {
  const form = useForm({
    resolver: zodResolver(contact ? contactSchemaDTO : contactSchema),
    defaultValues: contact ? contact : { email: "", location: "", phone: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  const { execute: save } = useEnhancedAction(updateContactInfoAction, {
    onSuccess(message) {
      toast.success(message);
    },
    onError(errors) {
      if (errors?.fieldError) {
        Object.entries(errors.fieldError).forEach(([field, message]) => {
          form.setError(field as never, {
            message: message,
          });
        });
      } else {
        toast.error(errors?.message);
      }
    },
  });

  const confirm = useConfirm();
  const handleUpdate = async (data: ContactSchema) => {
    await confirm({
      title: "Are you sure you want to save the Contact Information?",
      message:
        "Your contact information will be permanently changed and shown to users.",
      cancelText: "No",
      confirmText: "Save My Contact",
      action: async () => {
        await save({ ...contact, ...data });
      },
    });
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleUpdate)}>
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <IconMail className="h-4 w-4" />
                  Email Address
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <IconPhone className="h-4 w-4" />
                  Phone Number
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="tel"
                  placeholder="+977 5551234567"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <IconMapPin className="h-4 w-4" />
                  Location
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="San Francisco, CA"
                  disabled={isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field className="w-fit ">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
              )}

              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};
