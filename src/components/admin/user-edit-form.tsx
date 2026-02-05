"use client";

import { useState, useTransition } from "react";
import { User, Role, MembershipTier, UserRole, UserMembership } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateUser, type UpdateUserPayload } from "@/server/actions/users";
import { useRouter } from "next/navigation";
import { format, addMonths } from "date-fns";
import { Loader2 } from "lucide-react";

type FullUser = User & {
    officerTitle: string | null;
    roles: (UserRole & { role: Role })[];
    memberships: (UserMembership & { tier: MembershipTier })[];
};

interface UserEditFormProps {
    user: FullUser;
    currentUser: User;
    allRoles: Role[];
    allTiers: MembershipTier[];
}

export function UserEditForm({ user, currentUser, allRoles, allTiers }: UserEditFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [officerTitle, setOfficerTitle] = useState(user.officerTitle || "");
    const [selectedRoleKeys, setSelectedRoleKeys] = useState<string[]>(
        user.roles.map((r) => r.role.key)
    );

    const activeMembership = user.memberships.find(m => !m.validTo || new Date(m.validTo) > new Date());
    const [selectedTierKey, setSelectedTierKey] = useState<string>(activeMembership?.tier.key || "GENERAL");
    const [validToDate, setValidToDate] = useState<string>(
        activeMembership?.validTo ? format(new Date(activeMembership.validTo), "yyyy-MM-dd") : ""
    );

    const handleRoleToggle = (roleKey: string) => {
        setSelectedRoleKeys((prev) =>
            prev.includes(roleKey)
                ? prev.filter((k) => k !== roleKey)
                : [...prev, roleKey]
        );
    };

    const onSubmit = () => {
        const payload: UpdateUserPayload = {
            officerTitle,
            roleKeys: selectedRoleKeys,
            activeMembershipTierKey: selectedTierKey === "GENERAL" ? null : selectedTierKey,
            activeMembershipValidTo: validToDate ? new Date(validToDate) : null,
        };

        startTransition(async () => {
            try {
                await updateUser(user.id, payload);
                toast.success("User updated successfully");
                router.refresh();
            } catch (error: any) {
                toast.error(error.message || "Failed to update user");
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Section: Officer Title */}
            <section className="border border-white/10 bg-lsr-charcoal">
                <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="font-sans font-black text-sm uppercase tracking-widest text-white">
                        Officer Title
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                        Only visible when the user has an officer or admin role
                    </p>
                </div>
                <div className="p-6">
                    <div className="max-w-sm space-y-2">
                        <Label htmlFor="officerTitle" className="text-xs text-white/60 uppercase tracking-wider">
                            Title
                        </Label>
                        <Input
                            id="officerTitle"
                            placeholder="e.g. President, Treasurer"
                            value={officerTitle}
                            onChange={(e) => setOfficerTitle(e.target.value)}
                            className="rounded-none border-white/10 bg-white/5 text-white"
                        />
                    </div>
                </div>
            </section>

            {/* Section: Roles & Permissions */}
            <section className="border border-white/10 bg-lsr-charcoal">
                <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="font-sans font-black text-sm uppercase tracking-widest text-white">
                        Roles & Permissions
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                        Controls access to admin features and public badges
                    </p>
                </div>
                <div className="p-6 space-y-3">
                    {allRoles.map((role) => {
                        const isChecked = selectedRoleKeys.includes(role.key);
                        return (
                            <label
                                key={role.id}
                                className="flex items-start gap-3 p-3 border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <Checkbox
                                    id={role.key}
                                    checked={isChecked}
                                    onCheckedChange={() => handleRoleToggle(role.key)}
                                    className="mt-0.5"
                                />
                                <div className="space-y-0.5">
                                    <span className="font-bold text-xs text-white uppercase tracking-wider">
                                        {role.key}
                                    </span>
                                    {role.description && (
                                        <p className="text-[10px] text-white/40">
                                            {role.description}
                                        </p>
                                    )}
                                </div>
                            </label>
                        );
                    })}

                    <div className="bg-amber-900/20 border border-amber-900/50 p-4 text-xs text-amber-200 mt-4">
                        <strong>Caution:</strong> Modifying admin or officer roles is restricted
                        to System Administrators.
                    </div>
                </div>
            </section>

            {/* Section: Membership */}
            <section className="border border-white/10 bg-lsr-charcoal">
                <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="font-sans font-black text-sm uppercase tracking-widest text-white">
                        Membership
                    </h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                        Dues status and membership tier
                    </p>
                </div>
                <div className="p-6 space-y-5">
                    <div className="max-w-sm space-y-2">
                        <Label className="text-xs text-white/60 uppercase tracking-wider">
                            Tier
                        </Label>
                        <Select value={selectedTierKey} onValueChange={setSelectedTierKey}>
                            <SelectTrigger className="rounded-none border-white/10 bg-white/5 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-white/10 bg-lsr-charcoal text-white">
                                {allTiers.map(t => (
                                    <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedTierKey !== "GENERAL" && selectedTierKey !== "ALUMNI" && (
                        <div className="max-w-sm space-y-2">
                            <Label className="text-xs text-white/60 uppercase tracking-wider">
                                Valid Until
                            </Label>
                            <Input
                                type="date"
                                value={validToDate}
                                onChange={(e) => setValidToDate(e.target.value)}
                                className="rounded-none border-white/10 bg-white/5 text-white"
                            />
                            <div className="flex gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 text-[10px] uppercase tracking-widest rounded-none border-white/10 text-white/50 hover:text-white hover:border-white/20"
                                    onClick={() => setValidToDate(format(addMonths(new Date(), 6), "yyyy-MM-dd"))}
                                >
                                    +6 Months
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 text-[10px] uppercase tracking-widest rounded-none border-white/10 text-white/50 hover:text-white hover:border-white/20"
                                    onClick={() => setValidToDate(format(addMonths(new Date(), 12), "yyyy-MM-dd"))}
                                >
                                    +1 Year
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Save */}
            <div className="flex justify-end pt-2">
                <Button
                    disabled={isPending}
                    onClick={onSubmit}
                    className="rounded-none font-bold uppercase tracking-widest text-[10px] h-10 px-8 bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal transition-all"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
