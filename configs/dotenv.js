import env from "dotenv";
env.config();

const dotenv={
    PORT:process.env.PORT,
    MONODB_URL:process.env.MONODB_URL,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_CLOUD_API_KEY:process.env.CLOUDINARY_CLOUD_API_KEY,
    CLOUDINARY_CLOUD_API_SECRET:process.env.CLOUDINARY_CLOUD_API_SECRET
}

export default dotenv;