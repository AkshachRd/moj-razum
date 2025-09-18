import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    cn,
    useDisclosure,
} from '@heroui/react';
import { useHover } from 'react-aria';

import {
    AddNoteIcon,
    CopyDocumentIcon,
    EditDocumentIcon,
    DeleteDocumentIcon,
} from '@/shared/ui/icons';
import { debounce } from '@/shared/lib/debounce';
import { Card, CardComponent } from '@/entities/card';

interface CardItemDropdownProps {
    card: Card;
    onModalOpen: () => void;
}

const iconClasses = 'text-xl text-default-500 pointer-events-none shrink-0';

export function CardItemDropdown({ card, onModalOpen }: CardItemDropdownProps) {
    const {
        isOpen: isDropdownOpen,
        onOpen: onDropdownOpen,
        onClose: onDropdownClose,
    } = useDisclosure();
    const { hoverProps: cardHoverProps, isHovered: isCardHovered } = useHover({
        onHoverStart: onDropdownOpen,
        onHoverEnd: debounce(onDropdownClose, 300),
    });
    const { hoverProps: menuHoverProps, isHovered: isMenuHovered } = useHover({});

    return (
        <Dropdown
            className="w-full min-w-0"
            isOpen={isDropdownOpen || isMenuHovered}
            placement="right"
        >
            <DropdownTrigger>
                <button
                    className="w-full"
                    {...cardHoverProps}
                    onClick={() => {
                        onDropdownClose();
                        onModalOpen();
                    }}
                >
                    <CardComponent
                        footerContent={card.backSide}
                        headerContent={card.frontSide}
                        revealBack={isCardHovered}
                    />
                </button>
            </DropdownTrigger>
            <DropdownMenu
                {...menuHoverProps}
                aria-label="Dropdown menu with description"
                variant="faded"
            >
                <DropdownItem
                    key="new"
                    className="gap-x-0"
                    endContent={<AddNoteIcon className={iconClasses} />}
                    textValue="Add Note"
                />
                <DropdownItem
                    key="copy"
                    className="gap-x-0"
                    endContent={<CopyDocumentIcon className={iconClasses} />}
                    textValue="Copy"
                />
                <DropdownItem
                    key="edit"
                    className="gap-x-0"
                    endContent={<EditDocumentIcon className={iconClasses} />}
                    textValue="Edit"
                />
                <DropdownItem
                    key="delete"
                    className="text-danger gap-x-0"
                    color="danger"
                    endContent={<DeleteDocumentIcon className={cn(iconClasses, 'text-danger')} />}
                    textValue="Delete"
                />
            </DropdownMenu>
        </Dropdown>
    );
}
