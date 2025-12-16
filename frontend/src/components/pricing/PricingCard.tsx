"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming utils exists, or I will use clsx/tailwind-merge directly if not found, but package.json has them. usually in lib/utils.

interface PricingCardProps {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    isPopular?: boolean;
    billingCycle: "monthly" | "yearly";
    buttonText?: string;
    onSubscribe?: () => void;
}

export default function PricingCard({
    name,
    description,
    price,
    originalPrice,
    features,
    isPopular = false,
    billingCycle,
    buttonText = "Get Started",
    onSubscribe,
}: PricingCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={cn(
                "relative flex flex-col p-8 bg-white rounded-2xl shadow-lg border transition-all duration-300",
                isPopular ? "border-blue-500 shadow-blue-100 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"
            )}
        >
            {isPopular && (
                <div className="absolute top-0 right-0 -mr-1 -mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white shadow-sm">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="mb-5">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{description}</p>
            </div>

            <div className="mb-6">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">
                        ${price}
                    </span>
                    <span className="text-gray-500 mb-1">
                        / {billingCycle === "monthly" ? "mo" : "mo"}
                    </span>
                </div>
                {originalPrice && originalPrice > price && (
                    <div className="text-sm text-gray-400 mt-1">
                        <span className="line-through decoration-red-400 decoration-2">${originalPrice}</span>
                        <span className="ml-2 text-green-600 font-medium">Save 20%</span>
                    </div>
                )}
                {billingCycle === "yearly" && (
                    <div className="text-xs text-gray-400 mt-1">
                        Billed ${price * 12} yearly
                    </div>
                )}
            </div>

            <button
                onClick={onSubscribe}
                className={cn(
                    "w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 mb-8",
                    isPopular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                )}
            >
                {buttonText}
            </button>

            <div className="space-y-4 flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Features
                </p>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-500 shrink-0 mr-3" />
                            <span className="text-sm text-gray-600 leading-relaxed">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
