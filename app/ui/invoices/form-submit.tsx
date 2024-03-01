import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../button';

type FormSubmitProps = {
  cancelTitle?: ReactNode;
  confirmTitle?: ReactNode;
};

export default function FormSubmit(props: FormSubmitProps) {
  const { cancelTitle = 'Cancel', confirmTitle = 'Ok' } = props;
  const { pending } = useFormStatus();

  return (
    <div className="mt-6 flex justify-end gap-4">
      <Link
        href="/dashboard/invoices"
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        {cancelTitle}
      </Link>
      <Button disabled={pending} type="submit">
        {pending ? 'Loading...' : confirmTitle}
      </Button>
    </div>
  );
}
