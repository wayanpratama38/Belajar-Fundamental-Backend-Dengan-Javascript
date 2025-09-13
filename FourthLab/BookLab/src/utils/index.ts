interface DBStructure {
    id : string,
    title : string,
    body : string,
    tags : string[],
    created_at : string,
    updated_at : string
}

interface ModelStructure { 
    id : string,
    title : string,
    body : string,
    tags : string[],
    createdAt : string,
    updatedAt : string
}


const mapDBToModel= (input : DBStructure) : ModelStructure => ({
   id : input.id ,
   title : input.title,
   body : input.body,
   tags : input.tags,
   createdAt : input.created_at,
   updatedAt : input.updated_at, 
});

export { mapDBToModel };