
import { User } from '@prisma/client';

type DriverIdentityStripProps = {
  user: User;
};

export function DriverIdentityStrip({ user }: DriverIdentityStripProps) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex gap-8 md:col-span-1">
                <div>
                    <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">Major</div>
                    <div className="text-sm font-bold uppercase tracking-tight text-white">{user.major ?? 'Undeclared'}</div>
                </div>
                <div>
                    <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">Class</div>
                    <div className="text-sm font-bold uppercase tracking-tight text-white">{user.gradYear ? `'${user.gradYear.toString().slice(-2)}` : 'N/A'}</div>
                </div>
            </div>
            
            <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">About</div>
                <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-2">
                    {user.bio || 'No biography available.'}
                </p>
            </div>
        </div>
    </div>
  );
}
