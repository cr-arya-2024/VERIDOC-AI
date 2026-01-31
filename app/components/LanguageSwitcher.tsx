'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const t = useTranslations('LanguageSwitcher'); // We can add this key later or just hardcode for dropdown
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <select
            defaultValue={locale}
            disabled={isPending}
            onChange={handleChange}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="de">Deutsch (German)</option>
            <option value="zh-CN">简体中文 (Simplified Chinese)</option>
            <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="ko">한국어 (Korean)</option>
        </select>
    );
}
