import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        {props.children}
    </svg>
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </Icon>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </Icon>
);

export const CloudArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V15a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 15v2.25" />
    </Icon>
);

export const ClipboardDocumentListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h1.5v.75h-1.5v-.75zm.75 2.25h1.5v.75h-1.5v-.75zm.75 2.25h1.5v.75h-1.5v-.75zm.75 2.25h1.5v.75h-1.5v-.75zM6 15a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M4.5 12V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 011.123-.08" />
    </Icon>
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A1.125 1.125 0 018.82 17.5l.044-.044a1.125 1.125 0 011.59 0l.422.422a1.125 1.125 0 001.59 0l.422-.422a1.125 1.125 0 000-1.59l-3.72-3.72a1.125 1.125 0 00-1.59 0l-3.72 3.72a1.125 1.125 0 000 1.59l.422.422a1.125 1.125 0 010 1.59l.422.422a1.125 1.125 0 011.59 0l3.72-3.72c.884-.284 1.5-1.128 1.5-2.097v-4.286c0-1.136.847-2.1 1.98-2.193l3.72-3.72a1.125 1.125 0 011.59 0l3.72 3.72a1.125 1.125 0 010 1.59l-.422-.422a1.125 1.125 0 00-1.59 0l-.422.422a1.125 1.125 0 000 1.59l3.72 3.72a1.125 1.125 0 001.59 0l3.72-3.72c-.884.284-1.5 1.128-1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A1.125 1.125 0 013.75 17.5v-4.286c0-1.136.847-2.1 1.98-2.193l3.72-3.72a1.125 1.125 0 011.59 0l3.72 3.72a1.125 1.125 0 010 1.59l-3.72-3.72a1.125 1.125 0 00-1.59 0l-3.72 3.72a1.125 1.125 0 000 1.59l3.72 3.72a1.125 1.125 0 001.59 0l3.72-3.72a1.125 1.125 0 000-1.59l-3.72-3.72a1.125 1.125 0 00-1.59 0l-3.72 3.72" />
    </Icon>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </Icon>
);

export const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM5 11h3v4H5v-4zM19 16V9a1 1 0 00-1-1h-3.28a1 1 0 00-.94.66L12 11h7" />
    </Icon>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Icon>
);

export const BoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.5c0 .378-.214.725-.53 1.002S19.897 18 19.5 18h-15c-.397 0-.742-.23-.97-.53s-.329-.624-.329-1.002V9.75a1.5 1.5 0 011.5-1.5h15a1.5 1.5 0 011.5 1.5v6.75zM16.5 9.75h-9v6.75h9v-6.75z" />
    </Icon>
);

export const WarehouseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </Icon>
);

export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.113-1.113l.448-.11c.542-.132 1.057-.132 1.6 0l.448.11c.553.106 1.023.571 1.113 1.113l.068.418c.45.283.875.65 1.228 1.06l.423-.242c.52-.298 1.135-.245 1.58.11l.495.37c.446.334.625.958.423 1.48l-.202.53c-.18.473-.18.991 0 1.464l.202.53c.202.522.023 1.146-.423 1.48l-.495.37c-.445.354-1.06.308-1.58.11l-.423-.242a8.953 8.953 0 01-1.228 1.06l-.068.418c-.09.542-.56 1.007-1.113 1.113l-.448.11c-.542.132-1.057-.132-1.6 0l-.448-.11c-.553-.106-1.023-.571-1.113-1.113l-.068-.418a8.953 8.953 0 01-1.228-1.06l-.423.242c-.52.298-1.135-.245-1.58-.11l-.495-.37c-.446-.334-.625-.958-.423-1.48l.202-.53c.18-.473.18-.991 0 1.464l-.202-.53c-.202-.522-.023-1.146.423-1.48l.495-.37c.445-.354-1.06-.308-1.58-.11l.423.242c.453-.41.878-.777 1.228-1.06l.068-.418zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </Icon>
);

export const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.47-2.47a.64.64 0 00.9-.9l-2.47-2.47m-3.35-.477L1.612 8.246a.64.64 0 00-.9.9l6.634 6.634m2.85-3.535l4.242-4.242a.64.64 0 00.9-.9L13.732 4.37a.64.64 0 00-.9.9l3.535 3.535" />
    </Icon>
);

export const ArrowLeftOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </Icon>
);