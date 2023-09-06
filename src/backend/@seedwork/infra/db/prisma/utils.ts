import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import DuplicatedError from "../../../domain/errors/duplicated.error";

export function checkNotFoundError(msg: string, e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
    return new NotFoundError(msg);
  } else {
    return e;
  }
}

export function checkDuplicatedError(msg: string, e: unknown) {
  if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2002"
  ) {
    throw new DuplicatedError(msg);
  } else {
    throw e;
  }
}
