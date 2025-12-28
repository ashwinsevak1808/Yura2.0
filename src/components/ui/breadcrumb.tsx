import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {item.href && !isLast ? (
                                <a
                                    href={item.href}
                                    className="text-gray-500 hover:text-black transition-colors font-light"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <span className={isLast ? "text-black font-medium" : "text-gray-500 font-light"}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <ChevronRight className="w-4 h-4 text-gray-300" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
