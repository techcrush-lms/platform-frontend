"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input";
import { EyeIcon } from "lucide-react";
import { KYC } from "@/types/org";

interface KYCPreviewProps {
    kyc: KYC;
}

const FilePreview = ({ label, fileUrl }: { label: string; fileUrl: string }) => {
    if (!fileUrl) return null;

    const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i);

    return (
        <div className="mb-4">

            <Label>{label}</Label>

            <div className="flex items-center justify-between gap-x-2 p-1.5 mt-1 border border-gray-200 dark:border-gray-600 rounded-lg">

                <div className="flex items-center gap-2">
                    <img
                        src={
                            isImage
                                ? fileUrl
                                : fileUrl.endsWith(".pdf")
                                    ? "/pdf_image.png"
                                    : "/file_image.png"
                        }
                        alt="file preview"
                        className="size-6 object-cover rounded"
                    />
                    <p className="truncate text-sm text-black dark:text-white">{fileUrl.split("/").pop()}</p>
                </div>

                <a href={fileUrl} target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <EyeIcon className="w-5 h-5" />
                </a>

            </div>

        </div>
    );
};

const KYCPreview: React.FC<KYCPreviewProps> = ({ kyc }) => {
    return (
        <Card className="dark:border-gray-600 border-gray-200 text-black-1 dark:text-white">
            <CardHeader>
                <CardTitle>KYC Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div>
                    <Label>ID Type</Label>
                    <Input value={kyc.id_type} disabled className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    <FilePreview label="Document Front" fileUrl={kyc.doc_front} />
                    <FilePreview label="Document Back" fileUrl={kyc.doc_back} />
                    <FilePreview label="Utility Document" fileUrl={kyc.utility_doc} />
                </div>

                <div>
                    <Label>Address</Label>
                    <Input value={kyc.location} disabled className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
                </div>

                <div>
                    <Label>Country</Label>
                    <Input value={kyc.country} disabled className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
                </div>

                <div>
                    <Label>State</Label>
                    <Input value={kyc.state as string} disabled className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
                </div>

                <div>
                    <Label>City</Label>
                    <Input value={kyc.city} disabled className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
                </div>

                {!kyc.is_approved && kyc.disapproval_reason && (
                    <div>
                        <Label>Disapproval Reason</Label>
                        <p className="mt-1 text-red-600 dark:text-red-400">{kyc.disapproval_reason}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default KYCPreview;
