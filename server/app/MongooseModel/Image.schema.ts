// @ts-ignore
import * as mongoose from 'mongoose';

// fix all deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const imageSchema = mongoose.Schema({
    id: { type: Number },
    title: { type: String, required: true },
    tags: { type: [String], required: true },
    date: { type: Date, required: true },
    inlineSVG: { type: String, required: true },
    serializedSVG: { type: String, required: true },
});

export const Image = mongoose.model('Image', imageSchema);
