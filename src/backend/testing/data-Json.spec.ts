import { prisma } from "../@prisma/prisma";

test("it should create and update a document", async () => {
  const id = "1";
  let document = {
    id: "1",
    person: {
      name: "Celso",
      age: 59,
    },
  };

  const value = {
    id,
    dataJson: document,
  };

  await prisma.reportModel.deleteMany();
  await prisma.reportModel.create({
    data: value,
  });

  let model = await prisma.reportModel.findUniqueOrThrow({
    where: {
      id: "1",
    },
  });

  expect(model.dataJson).toStrictEqual(document);

  document.person.age = 59.3;

  await prisma.reportModel.update({
    where: { id },
    data: {
      dataJson: document,
    },
  });

  model = await prisma.reportModel.findUniqueOrThrow({
    where: {
      id: "1",
    },
  });

  const foundDocument = model.dataJson as typeof document;

  expect(foundDocument.person.name).toBe("Celso");
  expect(foundDocument.person.age).toBe(59.3);
});
