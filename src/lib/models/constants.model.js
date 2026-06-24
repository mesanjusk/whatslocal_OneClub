import { Schema, model, models } from "mongoose"

const constantsSchema = new Schema({
  dynamicInfoText: { type: String },
})

export default models.constants || model("constants", constantsSchema)
