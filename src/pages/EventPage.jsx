import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Stack,
  Avatar,
  Badge,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef } from "react";

export const eventLoader = async ({ params }) => {
  const [eventRes, usersRes, categoriesRes] = await Promise.all([
    fetch(`http://localhost:3000/events/${params.eventId}`),
    fetch("http://localhost:3000/users"),
    fetch("http://localhost:3000/categories"),
  ]);

  if (!eventRes.ok) throw new Error("Failed to fetch event");

  const [event, users, categories] = await Promise.all([
    eventRes.json(),
    usersRes.json(),
    categoriesRes.json(),
  ]);

  const user = users.find((u) => String(u.id) === String(event.createdBy));

  return { event, user, categories };
};

export const EventPage = () => {
  const { event, user, categories } = useLoaderData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    image: event.image,
    startTime: event.startTime,
    endTime: event.endTime,
  });

  const toast = useToast();
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();

  const onDeleteOpen = () => setIsDeleteOpen(true);
  const onDeleteClose = () => setIsDeleteOpen(false);

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, ...formData }),
    });

    if (res.ok) {
      toast({
        title: "Event updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Failed to update event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Event deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Failed to delete event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting event.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsDeleteOpen(false);
  };

  return (
    <Box p={6}>
      <Heading mb={2}>{event.title}</Heading>
      <Image src={event.image} alt={event.title} borderRadius="md" mb={4} />

      <Text fontSize="lg" mb={2}>
        {event.description}
      </Text>

      <Stack direction="row" spacing={4} mb={2}>
        <Text fontWeight="bold">Starts:</Text>
        <Text>{new Date(event.startTime).toLocaleString()}</Text>
        <Text fontWeight="bold">Ends:</Text>
        <Text>{new Date(event.endTime).toLocaleString()}</Text>
      </Stack>

      <Box mb={4}>
        <Text fontWeight="bold">Categories:</Text>
        <Stack direction="row" mt={1}>
          {event.categoryIds.map((id) => {
            const category = categories.find(
              (cat) => String(cat.id) === String(id)
            );
            return (
              <Badge key={id} colorScheme="blue">
                {category?.name || "Unknown"}
              </Badge>
            );
          })}
        </Stack>
      </Box>

      <Box mt={6}>
        <Text fontWeight="bold">Created by:</Text>
        <Stack direction="row" align="center" mt={2}>
          <Avatar name={user.name} src={user.image} />
          <Text>{user.name}</Text>
        </Stack>
      </Box>

      <Button onClick={onOpen} colorScheme="blue" mt={4}>
        Edit
      </Button>

      <Button onClick={onDeleteOpen} colorScheme="red" mt={4} ml={4}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              <Input
                type="datetime-local"
                value={formData.startTime.slice(0, 16)}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
              <Input
                type="datetime-local"
                value={formData.endTime.slice(0, 16)}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
