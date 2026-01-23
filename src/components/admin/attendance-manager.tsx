"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { manualCheckIn, manualRemoveCheckIn } from "@/app/admin/events/actions";
import { User, EventAttendance, EventRegistration } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QrCode, Download, UserPlus, X, Check, Maximize2 } from "lucide-react";

type AttendanceWithUser = EventAttendance & { user: User };
type RegistrationWithUser = EventRegistration & { user: User };

type AttendanceManagerProps = {
    eventId: string;
    eventTitle: string;
    checkInUrl: string;
    qrDataUrl: string;
    checkedIn: AttendanceWithUser[];
    missing: RegistrationWithUser[];
    walkIns: AttendanceWithUser[];
    allUsers: { id: string; displayName: string; handle: string }[];
};

export function AttendanceManager({ 
    eventId, 
    eventTitle,
    checkInUrl, 
    qrDataUrl, 
    checkedIn, 
    missing, 
    walkIns,
    allUsers 
}: AttendanceManagerProps) {
    const [qrOpen, setQrOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [manualSearch, setManualSearch] = useState("");

    // Filter users for manual check-in (exclude already checked in)
    const checkedInIds = new Set(checkedIn.map(a => a.userId));
    const availableUsers = allUsers.filter(u => !checkedInIds.has(u.id));
    const filteredUsers = availableUsers.filter(u => 
        u.displayName.toLowerCase().includes(manualSearch.toLowerCase()) || 
        u.handle.toLowerCase().includes(manualSearch.toLowerCase())
    ).slice(0, 10); // Limit results

    const downloadQr = () => {
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = `event-${eventId}-qr.png`;
        link.click();
    };

    // Fullscreen Overlay
    if (isFullscreen) {
        return (
            <div className="fixed inset-x-0 bottom-0 top-20 z-40 bg-black/40 backdrop-blur-sm p-6 animate-in fade-in duration-300">
                <div className="bg-lsr-charcoal/95 border border-white/10 rounded-xl h-full w-full flex flex-col items-center justify-center shadow-2xl relative overflow-hidden p-8 sm:p-16">
                    <Button 
                        onClick={() => setIsFullscreen(false)} 
                        variant="ghost" 
                        className="absolute top-8 right-8 text-white/30 hover:text-white hover:bg-white/5 rounded-none h-12 w-12"
                    >
                        <X className="h-8 w-8" />
                        <span className="sr-only">Close</span>
                    </Button>
                    
                    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-12 md:space-y-20">
                        <h1 className="font-display font-black italic uppercase text-4xl md:text-6xl lg:text-8xl text-center leading-[0.9] tracking-normal text-white">
                            {eventTitle}
                        </h1>
                        
                        <div className="bg-white p-4 rounded-none shadow-2xl ring-1 ring-white/10">
                            <img 
                                src={qrDataUrl} 
                                alt="Check-in QR Code" 
                                className="w-[45vh] h-[45vh] max-w-full object-contain" 
                            />
                        </div>
                        
                        <div className="text-center space-y-6">
                            <p className="font-sans font-medium text-sm md:text-base uppercase tracking-[0.5em] text-lsr-orange/80">Scan to Check In</p>
                            <div className="inline-block font-mono text-[10px] md:text-xs text-white/30 bg-white/[0.02] px-4 py-2 rounded-none border border-white/5 uppercase tracking-widest">
                                {checkInUrl}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold">Attendance</h2>
                    <p className="text-muted-foreground">
                        {checkedIn.length} Checked In • {missing.length} Missing • {walkIns.length} Walk-ins
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <QrCode className="mr-2 h-4 w-4" />
                                Show QR
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Check-in QR Code</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-6 space-y-4">
                                <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 border rounded-lg bg-white" />
                                <div className="text-center text-sm text-muted-foreground break-all">
                                    {checkInUrl}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={downloadQr} variant="secondary">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                    <Button onClick={() => setIsFullscreen(true)} variant="secondary">
                                        <Maximize2 className="mr-2 h-4 w-4" />
                                        Fullscreen
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Manual Check-In
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Manual Check-In</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input 
                                    placeholder="Search user..." 
                                    value={manualSearch}
                                    onChange={(e) => setManualSearch(e.target.value)}
                                />
                                <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded">
                                            <div>
                                                <div className="font-bold">{user.displayName}</div>
                                                <div className="text-xs text-muted-foreground">@{user.handle}</div>
                                            </div>
                                            <Button size="sm" onClick={() => manualCheckIn(eventId, user.id)}>
                                                Check In
                                            </Button>
                                        </div>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <div className="text-center text-muted-foreground p-4">No users found</div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="checked-in" className="w-full">
                <TabsList>
                    <TabsTrigger value="checked-in">Checked In ({checkedIn.length})</TabsTrigger>
                    <TabsTrigger value="missing">Missing ({missing.length})</TabsTrigger>
                    <TabsTrigger value="walk-ins">Walk-ins ({walkIns.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="checked-in" className="border rounded-md p-0">
                   <div className="divide-y">
                       {checkedIn.map(record => (
                           <div key={record.id} className="flex items-center justify-between p-3">
                               <div className="flex items-center gap-3">
                                   <Avatar className="h-8 w-8">
                                       <AvatarImage src={record.user.avatarUrl || undefined} />
                                       <AvatarFallback>{record.user.displayName[0]}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                       <div className="font-medium">{record.user.displayName}</div>
                                       <div className="text-xs text-muted-foreground">@{record.user.handle}</div>
                                   </div>
                                   <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded uppercase">{record.method}</span>
                               </div>
                               <div className="flex items-center gap-3">
                                   <div className="text-sm text-muted-foreground">{new Date(record.checkedInAt).toLocaleTimeString()}</div>
                                   <Button 
                                       size="icon" 
                                       variant="ghost" 
                                       className="h-8 w-8 text-destructive hover:text-destructive"
                                       onClick={() => manualRemoveCheckIn(eventId, record.user.id)}
                                   >
                                       <X className="h-4 w-4" />
                                   </Button>
                               </div>
                           </div>
                       ))}
                       {checkedIn.length === 0 && <div className="p-4 text-center text-muted-foreground">No check-ins yet.</div>}
                   </div>
                </TabsContent>

                <TabsContent value="missing" className="border rounded-md p-0">
                    <div className="divide-y">
                        {missing.map(reg => (
                            <div key={reg.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                   <Avatar className="h-8 w-8">
                                       <AvatarImage src={reg.user.avatarUrl || undefined} />
                                       <AvatarFallback>{reg.user.displayName[0]}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                       <div className="font-medium">{reg.user.displayName}</div>
                                       <div className="text-xs text-muted-foreground">@{reg.user.handle}</div>
                                   </div>
                                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded uppercase">{reg.status}</span>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => manualCheckIn(eventId, reg.user.id)}>
                                    <Check className="mr-2 h-3 w-3" />
                                    Check In
                                </Button>
                            </div>
                        ))}
                         {missing.length === 0 && <div className="p-4 text-center text-muted-foreground">Everyone registered has checked in!</div>}
                    </div>
                </TabsContent>

                <TabsContent value="walk-ins" className="border rounded-md p-0">
                    <div className="divide-y">
                        {walkIns.map(record => (
                            <div key={record.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                   <Avatar className="h-8 w-8">
                                       <AvatarImage src={record.user.avatarUrl || undefined} />
                                       <AvatarFallback>{record.user.displayName[0]}</AvatarFallback>
                                   </Avatar>
                                   <div>
                                       <div className="font-medium">{record.user.displayName}</div>
                                       <div className="text-xs text-muted-foreground">@{record.user.handle}</div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-muted-foreground">{new Date(record.checkedInAt).toLocaleTimeString()}</div>
                                    <Button 
                                       size="icon" 
                                       variant="ghost" 
                                       className="h-8 w-8 text-destructive hover:text-destructive"
                                       onClick={() => manualRemoveCheckIn(eventId, record.user.id)}
                                   >
                                       <X className="h-4 w-4" />
                                   </Button>
                                </div>
                            </div>
                        ))}
                        {walkIns.length === 0 && <div className="p-4 text-center text-muted-foreground">No walk-ins.</div>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}