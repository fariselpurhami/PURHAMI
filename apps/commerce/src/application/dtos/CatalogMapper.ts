// apps/commerce/src/application/dtos/CatalogMapper.ts

export class CatalogMapper {
  // تم تحويل الاسم إلى toProductContract لإرضاء GetProductByIdQuery
  static toProductContract(domainEntity: any) {
    // التأكد من استدعاء getProps إذا كانت دالة أو قراءتها مباشرة كـ object
    const props = typeof domainEntity.getProps === 'function' ? domainEntity.getProps() : domainEntity.getProps;
    
    return {
      id: props.id,
      title: props.title,
      slug: props.slug,
      descriptionHtml: props.descriptionHtml || '',
      vendor: props.vendor || 'PURHAMI',
      
      // التوافق مع عقد الصور الصارم (width & height)
      images: (props.images || []).map((img: any) => ({
        url: img.url,
        altText: img.altText || props.title,
        width: img.width || 1600,
        height: img.height || 2400
      })),
      
      variants: (props.variants || []).map((v: any) => {
        const vProps = typeof v.getProps === 'function' ? v.getProps() : v.getProps;
        
        // الوصول الآمن لكمية المخزون من الـ Value Object أو الخصائص المسطحة
        const inventoryQty = vProps.inventory?.getProps?.().quantityAvailable ?? 
                             vProps.inventory?.quantityAvailable ?? 
                             vProps.inventoryQuantity ?? 0;
        
        return {
          id: vProps.id,
          sku: vProps.sku,
          title: vProps.title,
          
          // تأمين كائن السعر المركب (Nested Object Contract)
          price: {
            currencyCode: vProps.price?.getProps?.().currencyCode ?? vProps.price?.currencyCode ?? 'USD',
            amount: vProps.price?.getProps?.().amount?.toString() ?? vProps.price?.amount?.toString() ?? vProps.price?.toString() ?? '0.00'
          },
          
          // تحويل القيمة الرقمية إلى Boolean صريح للـ Frontend Boundary
          availableForSale: inventoryQty > 0
        };
      })
    };
  }

  // تم تحويل الاسم إلى toMegaMenuContract لإرضاء GetMegaMenuQuery
  static toMegaMenuContract(domainEntities: any[]) {
    return (domainEntities || []).map((cat: any) => {
      const props = typeof cat.getProps === 'function' ? cat.getProps() : cat.getProps;
      return {
        title: props.title,
        links: props.links || []
      };
    });
  }
}
