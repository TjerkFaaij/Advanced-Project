import React, { useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Checkbox,
  CheckboxGroup,
  Stack,
  Flex,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const loader = async () => {
  const [eventRes, categoryRes] = await Promise.all([
    fetch("http://localhost:3000/events"),
    fetch("http://localhost:3000/categories"),
  ]);

  if (!eventRes.ok || !categoryRes.ok) throw new Error("Failed to load data");

  const [events, categories] = await Promise.all([
    eventRes.json(),
    categoryRes.json(),
  ]);

  return { events, categories };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected.map(Number));
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      event.categoryIds.every((id) => selectedCategories.includes((id)));
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={6}>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={4}
      >
        <Heading>All Events</Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button as={Link} to="/event/new" colorScheme="teal">
          Add Event
        </Button>
      </Flex>

      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          Filter by Category:
        </Text>
        <CheckboxGroup
          value={selectedCategories.map(String)}
          onChange={handleCategoryChange}
        >
          <Stack direction="row" wrap="wrap">
            {categories.map((cat) => (
              <Checkbox key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      {filteredEvents.length === 0 ? (
        <Text>No matching events found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <Card key={event.id} overflow="hidden" border="1px solid #eee">
                <Image
                  src={event.image}
                  alt={event.title}
                  height="200px"
                  objectFit="cover"
                />
                <CardBody>
                  <Heading size="md" mb={2}>
                    {event.title}
                  </Heading>
                  <Text mb={2}>{event.description}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(event.startTime).toLocaleString()} —{" "}
                    {new Date(event.endTime).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Location: {event.location}
                  </Text>
                </CardBody>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
