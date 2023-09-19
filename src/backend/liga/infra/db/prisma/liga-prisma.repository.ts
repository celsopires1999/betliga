import { prisma } from "@/backend/@prisma/prisma";
import {
  checkDuplicatedError,
  checkNotFoundError,
} from "@/backend/@seedwork/infra/db/prisma/utils";
import { Liga } from "../../../domain/entities/liga";
import { ILigaRepository } from "../../../domain/repository/liga.repository";

export class LigaPrismaRepository implements ILigaRepository {
  async bulkInsert(entities: Liga[]): Promise<void> {
    const teams = entities.map((e) => e.toJSON());
    try {
      await prisma.ligaModel.createMany({
        data: teams,
      });
    } catch (e) {
      throw checkDuplicatedError(
        `There are errors on creating multiple ligas ${entities
          .map((entity) => entity.name)
          .join(", ")}`,
        e
      );
    }
  }

  async findById(id: string): Promise<Liga> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Liga.restore({ id: model.id, name: model.name });
  }

  async findByName(name: string): Promise<Liga> {
    try {
      const model = await prisma.ligaModel.findUniqueOrThrow({
        where: { name },
      });
      return Liga.restore({ id: model.id, name: model.name });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using Name ${name}`, e);
    }
  }

  async findAll(): Promise<Liga[]> {
    try {
      const models = await prisma.ligaModel.findMany({
        orderBy: { name: "asc" },
      });
      return models.map((m) => Liga.restore({ id: m.id, name: m.name }));
    } catch (e) {
      throw e;
    }
  }

  private async _get(id: string) {
    try {
      return await prisma.ligaModel.findUniqueOrThrow({
        where: { id },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

// export class PlayerModelMapper {
//   static toEntity(model: PlayerModel) {
//     const { id, name, tenant_id } = model;
//     try {
//       return new Player(
//         { name, tenant_id: new TenantId(tenant_id) },
//         new PlayerId(id)
//       );
//     } catch (e) {
//       if (e instanceof EntityValidationError) {
//         throw new LoadEntityError(e.error);
//       }

//       throw e;
//     }
//   }
// }
