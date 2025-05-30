import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const NewEventPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      ...form,
      createdBy: 1,
      categoryIds: [],
    };

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) throw new Error("Failed to add event");

      toast({
        title: "Event added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading mb={6}>Add New Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" value={form.title} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              name="endTime"
              type="datetime-local"
              value={form.endTime}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input name="image" value={form.image} onChange={handleChange} />
          </FormControl>

          <Button colorScheme="teal" type="submit" mt={4}>
            Add Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
