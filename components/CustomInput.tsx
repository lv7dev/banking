import React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Control, FieldPath } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";
import z from "zod";

const formSchema = authFormSchema("sign-up");

interface CustomerInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
}: CustomerInputProps) => {
  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="form-item">
            <FieldLabel htmlFor={name} className="form-label">
              {label}
            </FieldLabel>
            <Input
              {...field}
              id={name}
              type={name === "password" ? "password" : "text"}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              className="input-class"
            />
            <FieldError
              errors={[fieldState.error]}
              className="form-message mt-2"
            />
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default CustomInput;
