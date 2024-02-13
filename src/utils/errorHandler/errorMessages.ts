export class ErrorMessages {
  static NOT_FOUND(model: string){
    return `${model} not found.`
  }

  static ID_NOT_VALID(id: string){
    return `Id ${id} is not valid.`
  }

  static CANNOT_CREATE(model: string){
    return `${model} cannot be created.`
  }

  static CANNOT_UPDATE(model: string){
    return `${model} cannot be updated.`
  }

  static CANNOT_DELETE(model: string){
    return `${model} cannot be deleted.`
  }

}