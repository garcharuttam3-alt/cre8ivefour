import Work from "../models/Work.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* ===============================
   CREATE WORK (ADMIN)
================================ */
export const createWork = async (req, res) => {
    try {
        // cover image is required
        if (!req.files?.coverImage) {
            return res.status(400).json({
                success: false,
                message: "Cover image is required",
            });
        }

        // upload cover image
        const coverResult = await cloudinary.uploader.upload(
            req.files.coverImage[0].path,
            { folder: "works" }
        );

        fs.unlinkSync(req.files.coverImage[0].path);

        // upload gallery images (optional)
        const galleryImages = [];
        if (req.files.galleryImages) {
            for (const file of req.files.galleryImages) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "works",
                });
                galleryImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        const work = await Work.create({
            ...req.body,
            coverImage: coverResult.secure_url,
            galleryImages,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: work,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   GET ALL WORKS (LIST PAGE)
================================ */
export const getAllWorks = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = { status: "published" };
        if (category && category !== "All") {
            filter.category = category;
        }

        const works = await Work.find(filter)
            .select("title slug category coverImage shortDescription isFeatured")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: works.length,
            data: works,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   GET SINGLE WORK (DETAIL PAGE)
================================ */
export const getWorkBySlug = async (req, res) => {
    try {
        const work = await Work.findOne({
            slug: req.params.slug,
            status: "published",
        });

        if (!work) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            data: work,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   UPDATE WORK (ADMIN)
================================ */
export const updateWork = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // if new cover image provided
        if (req.files?.coverImage) {
            const coverResult = await cloudinary.uploader.upload(
                req.files.coverImage[0].path,
                { folder: "works" }
            );
            updateData.coverImage = coverResult.secure_url;
            fs.unlinkSync(req.files.coverImage[0].path);
        }

        // if new gallery images provided
        if (req.files?.galleryImages) {
            const galleryImages = [];
            for (const file of req.files.galleryImages) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "works",
                });
                galleryImages.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
            updateData.galleryImages = galleryImages;
        }

        const updatedWork = await Work.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedWork) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedWork,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* ===============================
   DELETE WORK (ADMIN)
================================ */
export const deleteWork = async (req, res) => {
    try {
        const work = await Work.findById(req.params.id);

        if (!work) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        await work.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

