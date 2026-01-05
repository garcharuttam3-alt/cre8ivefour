import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        category: {
            type: String,
            required: true,
            enum: ["Website", "Software", "UI/UX", "E-commerce", "Static Website"],
        },

        client: {
            type: String,
            required: true,
        },

        year: {
            type: String,
            required: true,
        },

        shortDescription: {
            type: String,
            required: true,
            maxlength: 180,
        },

        overview: {
            type: String,
            required: true,
        },

        challenge: {
            type: String,
            required: true,
        },

        solution: {
            type: String,
            required: true,
        },

        // 🔗 MAIN IMAGE (URL)
        coverImage: {
            type: String,
            required: true,
        },

        // 🔗 GALLERY IMAGES (URLs)
        galleryImages: [
            {
                type: String,
            },
        ],

        techStack: [
            {
                type: String,
            },
        ],

        liveUrl: {
            type: String,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Work", workSchema);
