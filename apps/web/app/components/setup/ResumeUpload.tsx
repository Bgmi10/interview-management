import { useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload, FileText, XCircle } from "lucide-react";

const ResumeUpload = ({ setForm }: { setForm: any }) => {
    const [file, setFile] = useState<any>(null);

    const handleFileChange = (e: any) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setForm((p: any) => ({...p, resume: uploadedFile}));
        }
    };

    const removeFile = () => setFile(null);

    return (
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resume
            </label>
            <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-black cursor-pointer hover:border-blue-500 transition">
                {file ? (
                    <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button onClick={removeFile} className="text-red-500 hover:text-red-700">
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                        <CloudUpload className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">Drag & Drop or Click to Upload</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Only .pdf, .doc, .docx</p>
                        <input 
                            type="file" 
                            name="resume" 
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </div>
        </motion.div>
    );
};

export default ResumeUpload;
