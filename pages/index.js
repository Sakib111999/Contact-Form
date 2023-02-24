import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { sendContactForm } from "../lib/api";

const initValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const initState = { isLoading: false, error: "", values: initValues };

export default function Home() {
  const toast = useToast();
  const [state, setState] = useState(initState);
  const [touched, setTouched] = useState({});

  const onBlur = ({ target }) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const { values, isLoading, error } = state;

  const handleChange = ({ target }) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: [target.value],
      },
    }));

  const onSubmit = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      await sendContactForm(values);
      setTouched({});
      setState(initState);
      toast({
        title: "Message sent.",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  return (
    <Container maxW="450px" mt={12}>
      <Heading>Contact Page</Heading>

      {error && (
        <Text color="red.300" my={4} fontSize="xl">
          {error}
        </Text>
      )}

      <FormControl isRequired isInvalid={touched.name && !values.name} mb={5}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          name="name"
          errorBorderColor="red.300"
          value={values.name}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl isRequired mb={5} isInvalid={touched.email && !values.email}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        mb={5}
        isInvalid={touched.subject && !values.subject}
      >
        <FormLabel>Subject</FormLabel>
        <Input
          type="text"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        mb={5}
        isInvalid={touched.message && !values.message}
      >
        <FormLabel>Message</FormLabel>
        <Textarea
          type="text"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      <Button
        variant="outline"
        colorScheme="blue"
        disabled={
          !values.name || !values.email || !values.subject || !values.message
        }
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Submit
      </Button>
    </Container>
  );
}
