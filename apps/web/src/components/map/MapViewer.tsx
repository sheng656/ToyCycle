'use client';

import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import type { ToyWithImages } from '@toycycle/shared';
import { useRouter } from '@/i18n/navigation';

interface MapViewerProps {
  toys: ToyWithImages[];
  className?: string;
}

export default function MapViewer({ toys, className = '' }: MapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. 设置高德地图安全密钥
    if (typeof window !== 'undefined') {
      (window as any)._AMapSecurityConfig = {
        securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || '',
      };
    }

    // 2. 加载高德地图 API
    AMapLoader.load({
      key: process.env.NEXT_PUBLIC_AMAP_KEY || '',
      version: '2.0',
      plugins: ['AMap.Marker', 'AMap.InfoWindow'],
    })
      .then((AMap) => {
        if (!mapRef.current) return;

        // 计算中心点 (简单计算所有有坐标的玩具的平均位置)
        let center = [116.397428, 39.90923]; // 默认北京天安门
        const validToys = toys.filter((t) => t.longitude && t.latitude);
        
        if (validToys.length > 0) {
          const sumLng = validToys.reduce((sum, t) => sum + (t.longitude || 0), 0);
          const sumLat = validToys.reduce((sum, t) => sum + (t.latitude || 0), 0);
          center = [sumLng / validToys.length, sumLat / validToys.length];
        }

        // 初始化地图
        const map = new AMap.Map(mapRef.current, {
          viewMode: '2D',
          zoom: 13,
          center,
          mapStyle: 'amap://styles/normal', // 正常样式
        });

        setMapInstance(map);

        // 创建信息窗体
        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30),
          isCustom: false, // 使用默认样式
        });

        // 添加 Marker
        validToys.forEach((toy) => {
          const marker = new AMap.Marker({
            position: [toy.longitude!, toy.latitude!],
            title: toy.title,
            map: map,
          });

          // 自定义 marker 图标样式
          const markerContent = document.createElement('div');
          markerContent.className = 'w-10 h-10 bg-primary rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-lg cursor-pointer transform hover:scale-110 transition-transform';
          markerContent.innerHTML = '🧸';
          marker.setContent(markerContent);

          // 点击弹窗
          marker.on('click', () => {
            const coverImage = toy.images?.[0]?.image_url || '/placeholder-toy.png';
            
            // 构建弹窗内容
            const infoContent = document.createElement('div');
            infoContent.className = 'p-3 max-w-[200px] cursor-pointer';
            infoContent.innerHTML = `
              <img src="${coverImage}" alt="${toy.title}" class="w-full h-24 object-cover rounded-lg mb-2" />
              <h3 class="font-bold text-sm truncate">${toy.title}</h3>
              <p class="text-xs text-muted mt-1">💰 ${toy.estimated_value} 玩具币</p>
              <button class="w-full mt-3 bg-primary text-white text-xs font-bold py-1.5 rounded-lg hover:bg-primary-dark">查看详情</button>
            `;
            
            // 点击弹窗跳转到详情页
            infoContent.addEventListener('click', () => {
              router.push(`/toys/${toy.id}`);
            });

            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker.getPosition());
          });
        });
      })
      .catch((e) => {
        console.error('AMap load error:', e);
      });

    return () => {
      // 销毁地图实例
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toys]); // 注意: 在实际生产中可能需要更精细的依赖控制，避免频繁重新加载API

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-inner border border-border bg-surface-container-low ${className}`}
    />
  );
}
