'use server';
import zod from 'zod';

import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/dist/client/components/navigation';

const FormSchema = zod.object({
  id: zod.string(),
  customer_id: zod.string(),
  amount: zod.coerce.number(),
  date: zod.string(),
  status: zod.enum(['pending', 'paid']),
});

const InvoiceSchema = FormSchema.omit({ id: true, date: true });

export async function createInvoice(invoice: FormData) {
  const fmtData = InvoiceSchema.parse({
    amount: invoice.get('amount'),
    customer_id: invoice.get('customerId'),
    status: invoice.get('status'),
  });

  const amount = fmtData.amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date) 
      VALUES (${fmtData.customer_id}, ${amount}, ${fmtData.status}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, invoice: FormData) {
  const fmtData = InvoiceSchema.parse({
    amount: invoice.get('amount'),
    customer_id: invoice.get('customerId'),
    status: invoice.get('status'),
  });

  const date = new Date().toISOString().split('T')[0];
  const amount = fmtData.amount * 100;

  try {
    await sql`
    UPDATE invoices set amount=${amount}, date=${date}, customer_id=${fmtData.customer_id} where id=${id}
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
