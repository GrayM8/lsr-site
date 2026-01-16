"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { previewParseResult } from "@/app/admin/results/actions";
import { type RawResultUpload, type User, type ParseReport } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ResultWithRelations = RawResultUpload & {
  uploadedBy: User;
  parseReport: ParseReport | null;
};

export function ResultDetailClient({ result: initialResult }: { result: ResultWithRelations }) {
  const [result, setResult] = useState(initialResult);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleParse = async () => {
    setIsParsing(true);
    setError(null);
    try {
      const updatedResult = await previewParseResult(result.id);
      setResult(updatedResult as ResultWithRelations);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button asChild>
          <Link href="/admin/results">Back to Results List</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{result.filename}</CardTitle>
          <CardDescription>
            Uploaded by {result.uploadedBy.displayName} on{" "}
            {new Date(result.uploadedAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Status: {result.status}</p>
          <p>Size: {result.filesize} bytes</p>
          <p>SHA256: {result.sha256}</p>
          {result.errorMessage && <p className="text-red-500">Error: {result.errorMessage}</p>}
        </CardContent>
      </Card>

      <Button onClick={handleParse} disabled={isParsing}>
        {isParsing ? "Parsing..." : "Preview Parse"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}

      {result.parseReport && (
        <Card>
          <CardHeader>
            <CardTitle>Parse Report</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-bold">Drivers ({result.parseReport.drivers.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GUID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Car</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(result.parseReport.drivers as any[]).map((driver) => (
                  <TableRow key={driver.guid}>
                    <TableCell>{driver.guid}</TableCell>
                    <TableCell>{driver.driverName}</TableCell>
                    <TableCell>{driver.carModel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="font-bold mt-6">Counts</h3>
            <p>Results: {result.parseReport.resultsCount}</p>
            <p>Laps: {result.parseReport.lapsCount}</p>

            {result.parseReport.anomalies.length > 0 && (
              <>
                <h3 className="font-bold mt-6">Anomalies</h3>
                <ul>
                  {result.parseReport.anomalies.map((anomaly, i) => (
                    <li key={i} className="text-red-500">
                      {anomaly}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
