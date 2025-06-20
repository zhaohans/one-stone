import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";

export default {
  title: "UI/Form",
};

export const Default = () => {
  const methods = useForm({ defaultValues: { example: "" } });
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => alert(JSON.stringify(data)))}
      >
        <FormField
          name="example"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <input {...field} placeholder="Type here..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};
