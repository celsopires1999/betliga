import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";
import { prisma } from "@/backend/@prisma/prisma";
import { Liga } from "../../../domain/entities/liga";
import { ILigaRepository } from "../../../domain/repository/liga.respository";

export class LigaPrismaRepository implements ILigaRepository {
  async findById(id: string): Promise<Liga> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Liga.restore({ id: model.id, name: model.name });
  }

  async findAll(): Promise<Liga[]> {
    throw new Error("Method not implemented.");
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
