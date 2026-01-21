"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadResult } from "@/app/admin/results/actions";
import { type RawResultUpload, type User, type Event } from "@prisma/client";
import { Download } from "lucide-react";

type ResultWithUser = RawResultUpload & {
  uploadedBy: User;
  event: Event | null;
};

const formSchema = z.object({
  file: z.instanceof(File),
});

export function ResultsAdminClient({
  results: initialResults,
}: {
  results: ResultWithUser[];
}) {
  const [results, setResults] = useState(initialResults);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", values.file);

    try {
      const newResult = await uploadResult(formData);
      if (newResult) {
        setResults([{ ...newResult, event: null }, ...results]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsUploading(false);
      form.reset();
    }
  };

  const downloadJson = (result: ResultWithUser) => {
    const jsonString = JSON.stringify(result.rawJson, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Result JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Result File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files ? e.target.files[0] : null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Button asChild>
            <Link href="/admin">Back to Admin Dashboard</Link>
          </Button>
        </div>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Assigned Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <a href={`/admin/results/${result.id}`} className="text-blue-500 hover:underline">
                        {result.filename}
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(result.uploadedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                        {result.event ? (
                            <span className="font-medium">{result.event.title}</span>
                        ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                    </TableCell>
                    <TableCell>{result.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => downloadJson(result)}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
