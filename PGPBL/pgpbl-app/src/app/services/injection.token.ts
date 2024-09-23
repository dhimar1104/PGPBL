import { InjectionToken } from '@angular/core';
import { IpinfoService } from 'src/app/services/ipinfo.service'; // Ganti dengan path yang benar

export const IPINFO_SERVICE = new InjectionToken<IpinfoService>('IpinfoService');
