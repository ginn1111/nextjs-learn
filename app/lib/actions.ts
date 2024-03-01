'use server';
import zod from 'zod';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/dist/client/components/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = zod.object({
  id: zod.string(),
  customerId: zod.string({
    invalid_type_error: 'Please select a customer',
  }),
  amount: zod.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0' }),
  date: zod.string(),
  status: zod.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

const InvoiceSchema = FormSchema.omit({ id: true, date: true });

export async function createInvoice(currentState: State, invoice: FormData) {
  const fmtData = InvoiceSchema.safeParse({
    amount: invoice.get('amount'),
    customerId: invoice.get('customerId'),
    status: invoice.get('status'),
  });

  if (!fmtData.success) {
    return {
      errors: fmtData.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create invoice',
    };
  }

  const amount = fmtData.data.amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date) 
      VALUES (${fmtData.data.customerId}, ${amount}, ${fmtData.data.status}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  currentState: State,
  invoice: FormData,
) {
  const fmtData = InvoiceSchema.safeParse({
    amount: invoice.get('amount'),
    customerId: invoice.get('customerId'),
    status: invoice.get('status'),
  });

  if (!fmtData.success) {
    return {
      errors: fmtData.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create invoice',
    };
  }

  const date = new Date().toISOString().split('T')[0];
  const amount = fmtData.data.amount * 100;

  try {
    await sql`
    UPDATE invoices set amount=${amount}, date=${date}, customer_id=${fmtData.data.customerId} where id=${id}
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to update Invoice',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`
    DELETE FROM invoices where id=${id}
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  credentials: FormData,
) {
  try {
    await signIn('credentials', credentials);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return 'Invalid credentials';
        }
        default:
          return 'Some thing went wrong';
      }
    }

    throw error;
  }
}
