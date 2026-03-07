
import { BrandIcon, type SimpleIcon } from '@/components/brand-icon';
import { siInstagram, siYoutube, siTwitch } from 'simple-icons/icons';
import { Globe, type LucideIcon } from 'lucide-react';

type DriverMetadataProps = {
  socials: Record<string, string>;
  iRating: number | null;
};

export function DriverMetadata({ socials, iRating }: DriverMetadataProps) {
  const simpleIconSocials: Record<string, SimpleIcon> = {
    instagram: siInstagram,
    twitch: siTwitch,
    youtube: siYoutube,
  };
  const componentIconSocials: Record<string, LucideIcon> = {
    website: Globe,
  };

  const validSocials = Object.entries(socials).filter(([_, val]) => !!val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
        {/* Comms */}
        <div>
            <h4 className="font-sans font-bold text-xs text-white/60 uppercase tracking-[0.2em] mb-4">Comms Links</h4>
            <div className="flex gap-4">
                {validSocials.length > 0 ? (
                    validSocials.map(([key, value]) => {
                        if (!value) return null;
                        const IconData = simpleIconSocials[key];
                        const IconComponent = componentIconSocials[key];
                        
                        return (
                            <a 
                                key={key} 
                                href={value} 
                                target="_blank" 
                                rel="noreferrer"
                                className="h-10 w-10 border border-white/10 bg-white/[0.02] flex items-center justify-center hover:bg-lsr-orange hover:border-lsr-orange hover:text-white transition-all group"
                            >
                                {IconData ? (
                                    <BrandIcon icon={IconData} className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : IconComponent ? (
                                    <IconComponent className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : null}
                            </a>
                        );
                    })
                ) : (
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">No active links</span>
                )}
            </div>
        </div>

        {/* Extra Metadata */}
        <div>
            <h4 className="font-sans font-bold text-xs text-white/60 uppercase tracking-[0.2em] mb-4">Driver Metadata</h4>
            <div className="flex gap-8">
                <div>
                    <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">iRating</div>
                    <div className="font-mono text-sm font-bold text-lsr-orange">{iRating ?? 'N/A'}</div>
                </div>
                {/* Add more fields here later */}
            </div>
        </div>
        
        {/* Placeholder */}
        <div className="md:col-span-2 mt-8 opacity-30">
             <p className="font-sans text-[9px] text-white/20 uppercase tracking-widest text-center border border-dashed border-white/10 p-4">
                Advanced telemetry analysis modules pending integration.
             </p>
        </div>
    </div>
  );
}
