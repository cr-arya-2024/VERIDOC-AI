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
            <option value="en">en</option>
            <option value="es">es</option>
            <option value="fr">fr</option>
            <option value="hi">hi</option>
            <option value="de">de</option>
            <option value="zh-CN">zh-CN</option>
            <option value="zh-TW">zh-TW</option>
            <option value="ja">ja</option>
            <option value="ko">ko</option>
        </select>
    );
}
