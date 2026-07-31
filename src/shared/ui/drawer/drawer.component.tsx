import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { drawerApi, useDrawersStore } from '@/shared/model/drawer/drawers.store';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

type DrawerProps = {
  name: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const Drawer = ({ name, title, children, footer, className }: DrawerProps) => {
  const open = useDrawersStore((state) => state.open.has(name));

  return (
    <Dialog.Root open={open} onOpenChange={(isVisible) => drawerApi.setOpen(name, isVisible)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />

        <Dialog.Content
          className={cn(
            'fixed inset-4 z-50 flex flex-col rounded-3xl bg-raised shadow-xl outline-none md:max-w-md md:left-auto md:w-full',
            className,
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <Dialog.Title className="text-xl font-semibold text-text">{title}</Dialog.Title>

            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Закрыть">
                <Icon name="common:close" className="size-5" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

          {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
