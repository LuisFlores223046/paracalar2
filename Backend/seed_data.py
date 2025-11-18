#!/usr/bin/env python3
"""
Script para poblar la base de datos RDS con datos de prueba
Autor: Claude
Fecha: 2025-11-18
Descripción: Crea productos, categorías, tiers de lealtad y cupones de prueba
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.loyalty_tier import LoyaltyTier
from app.models.coupon import Coupon
from decimal import Decimal
from datetime import date, timedelta
import sys

def create_loyalty_tiers(db: Session):
    """Crear los 3 niveles de lealtad"""
    print("📊 Creando Loyalty Tiers...")

    tiers_data = [
        {
            "tier_level": 1,
            "min_points_required": 0,
            "points_multiplier": Decimal("1.0"),
            "free_shipping_threshold": Decimal("1000.00"),
            "monthly_coupons_count": 1,
            "coupon_discount_percentage": 5
        },
        {
            "tier_level": 2,
            "min_points_required": 500,
            "points_multiplier": Decimal("1.5"),
            "free_shipping_threshold": Decimal("750.00"),
            "monthly_coupons_count": 3,
            "coupon_discount_percentage": 10
        },
        {
            "tier_level": 3,
            "min_points_required": 1500,
            "points_multiplier": Decimal("2.0"),
            "free_shipping_threshold": Decimal("500.00"),
            "monthly_coupons_count": 5,
            "coupon_discount_percentage": 15
        }
    ]

    for tier_data in tiers_data:
        # Verificar si ya existe
        existing = db.query(LoyaltyTier).filter_by(tier_level=tier_data["tier_level"]).first()
        if not existing:
            tier = LoyaltyTier(**tier_data)
            db.add(tier)
            print(f"  ✓ Tier {tier_data['tier_level']} creado")
        else:
            print(f"  ⊙ Tier {tier_data['tier_level']} ya existe")

    db.commit()
    print("✅ Loyalty Tiers completados\n")


def create_coupons(db: Session):
    """Crear cupones de descuento"""
    print("🎟️  Creando Cupones...")

    coupons_data = [
        {
            "coupon_code": "WELCOME10",
            "discount_value": Decimal("10.00"),
            "start_date": date.today(),
            "expiration_date": date.today() + timedelta(days=365),
            "is_active": True
        },
        {
            "coupon_code": "FITNESS20",
            "discount_value": Decimal("20.00"),
            "start_date": date.today(),
            "expiration_date": date.today() + timedelta(days=90),
            "is_active": True
        },
        {
            "coupon_code": "SUMMER50",
            "discount_value": Decimal("50.00"),
            "start_date": date.today(),
            "expiration_date": date.today() + timedelta(days=60),
            "is_active": True
        },
        {
            "coupon_code": "VIP100",
            "discount_value": Decimal("100.00"),
            "start_date": date.today(),
            "expiration_date": date.today() + timedelta(days=180),
            "is_active": True
        }
    ]

    for coupon_data in coupons_data:
        existing = db.query(Coupon).filter_by(coupon_code=coupon_data["coupon_code"]).first()
        if not existing:
            coupon = Coupon(**coupon_data)
            db.add(coupon)
            print(f"  ✓ Cupón {coupon_data['coupon_code']} creado (${coupon_data['discount_value']})")
        else:
            print(f"  ⊙ Cupón {coupon_data['coupon_code']} ya existe")

    db.commit()
    print("✅ Cupones completados\n")


def create_products(db: Session):
    """Crear 20 productos en 5 categorías"""
    print("🏋️  Creando Productos...")

    # 5 Categorías
    categories = {
        "Proteínas": [
            {
                "name": "Whey Protein Gold Standard 5lb",
                "brand": "Optimum Nutrition",
                "description": "Proteína de suero de leche de alta calidad con 24g de proteína por porción. Ideal para recuperación muscular post-entrenamiento.",
                "nutritional_value": "Por porción (32g): 120 calorías, 24g proteína, 3g carbohidratos, 1g grasa",
                "price": Decimal("899.00"),
                "stock": 50,
                "physical_activities": ["Gym", "CrossFit", "Running"],
                "fitness_objectives": ["Ganar músculo", "Recuperación"],
                "image_url": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"
            },
            {
                "name": "Isolate Protein Zero Carb 2lb",
                "brand": "Dymatize",
                "description": "Proteína aislada sin carbohidratos ni azúcares. Perfecta para definición muscular.",
                "nutritional_value": "Por porción (28g): 110 calorías, 25g proteína, 0g carbohidratos, 0.5g grasa",
                "price": Decimal("749.00"),
                "stock": 35,
                "physical_activities": ["Gym", "Bodybuilding", "CrossFit"],
                "fitness_objectives": ["Definición", "Ganar músculo"],
                "image_url": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400"
            },
            {
                "name": "Plant-Based Protein Vegan 1.5lb",
                "brand": "Vega",
                "description": "Proteína vegetal de guisante y arroz. 20g de proteína completa por porción.",
                "nutritional_value": "Por porción (30g): 130 calorías, 20g proteína, 5g carbohidratos, 2g grasa",
                "price": Decimal("599.00"),
                "stock": 25,
                "physical_activities": ["Yoga", "Running", "Gym"],
                "fitness_objectives": ["Salud general", "Vegano"],
                "image_url": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400"
            },
            {
                "name": "Casein Protein Night Recovery 4lb",
                "brand": "MuscleTech",
                "description": "Proteína de caseína de absorción lenta. Ideal para tomar antes de dormir.",
                "nutritional_value": "Por porción (34g): 120 calorías, 24g proteína, 3g carbohidratos, 1g grasa",
                "price": Decimal("799.00"),
                "stock": 20,
                "physical_activities": ["Gym", "Bodybuilding"],
                "fitness_objectives": ["Ganar músculo", "Recuperación"],
                "image_url": "https://images.unsplash.com/photo-1607073683974-34a096c12d88?w=400"
            }
        ],
        "Pre-Entreno": [
            {
                "name": "C4 Original Pre-Workout 60 servicios",
                "brand": "Cellucor",
                "description": "Pre-entreno con 150mg de cafeína y beta-alanina. Energía y concentración para entrenamientos intensos.",
                "nutritional_value": "Por porción (6.5g): 5 calorías, 150mg cafeína, 1.6g beta-alanina, 1g creatina",
                "price": Decimal("649.00"),
                "stock": 45,
                "physical_activities": ["Gym", "CrossFit", "Running"],
                "fitness_objectives": ["Energía", "Rendimiento"],
                "image_url": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"
            },
            {
                "name": "Total War Pre-Workout 30 servicios",
                "brand": "Redcon1",
                "description": "Pre-entreno de alta intensidad con 320mg de cafeína. Para entrenamientos extremos.",
                "nutritional_value": "Por porción (14.7g): 10 calorías, 320mg cafeína, 3.2g beta-alanina, 6g citrulina",
                "price": Decimal("749.00"),
                "stock": 30,
                "physical_activities": ["CrossFit", "Gym", "HIIT"],
                "fitness_objectives": ["Energía", "Fuerza"],
                "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400"
            },
            {
                "name": "Pump Pre-Workout Sin Cafeína",
                "brand": "ANS Performance",
                "description": "Pre-entreno sin estimulantes. Máximo pump muscular sin cafeína.",
                "nutritional_value": "Por porción (15g): 5 calorías, 0mg cafeína, 8g citrulina, 3g beta-alanina",
                "price": Decimal("699.00"),
                "stock": 20,
                "physical_activities": ["Gym", "Bodybuilding"],
                "fitness_objectives": ["Pump", "Rendimiento"],
                "image_url": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
            },
            {
                "name": "Pre-Kaged Elite Pre-Workout",
                "brand": "Kaged Muscle",
                "description": "Pre-entreno premium con ingredientes de grado farmacéutico.",
                "nutritional_value": "Por porción (11.5g): 10 calorías, 274mg cafeína, 6.5g citrulina, 1.6g beta-alanina",
                "price": Decimal("899.00"),
                "stock": 15,
                "physical_activities": ["Gym", "CrossFit"],
                "fitness_objectives": ["Energía", "Concentración"],
                "image_url": "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400"
            }
        ],
        "Creatinas": [
            {
                "name": "Creatine Monohydrate 500g",
                "brand": "Optimum Nutrition",
                "description": "Creatina monohidratada micronizada pura. 5g por porción. Aumenta fuerza y masa muscular.",
                "nutritional_value": "Por porción (5g): 0 calorías, 5g creatina monohidratada",
                "price": Decimal("399.00"),
                "stock": 60,
                "physical_activities": ["Gym", "CrossFit", "Bodybuilding"],
                "fitness_objectives": ["Ganar músculo", "Fuerza"],
                "image_url": "https://images.unsplash.com/photo-1608138969275-fbc7748f39e3?w=400"
            },
            {
                "name": "Creatine HCL 120 cápsulas",
                "brand": "MuscleTech",
                "description": "Creatina HCL de alta absorción. Sin fase de carga ni retención de líquidos.",
                "nutritional_value": "Por porción (2 caps): 1.5g creatina HCL",
                "price": Decimal("549.00"),
                "stock": 40,
                "physical_activities": ["Gym", "Running", "CrossFit"],
                "fitness_objectives": ["Fuerza", "Resistencia"],
                "image_url": "https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=400"
            },
            {
                "name": "Creatine + Glutamine Stack 600g",
                "brand": "BSN",
                "description": "Combinación de creatina y glutamina para máxima recuperación y crecimiento muscular.",
                "nutritional_value": "Por porción (10g): 5g creatina, 5g glutamina",
                "price": Decimal("649.00"),
                "stock": 25,
                "physical_activities": ["Gym", "Bodybuilding"],
                "fitness_objectives": ["Ganar músculo", "Recuperación"],
                "image_url": "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400"
            },
            {
                "name": "Creatine Alkaline 240 caps",
                "brand": "EFX Sports",
                "description": "Kre-Alkalyn® pH correcto. No se convierte en creatinina en el estómago.",
                "nutritional_value": "Por porción (2 caps): 1.5g Kre-Alkalyn®",
                "price": Decimal("599.00"),
                "stock": 30,
                "physical_activities": ["Gym", "CrossFit"],
                "fitness_objectives": ["Fuerza", "Rendimiento"],
                "image_url": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400"
            }
        ],
        "Quemadores": [
            {
                "name": "Hydroxycut Hardcore Elite 110 caps",
                "brand": "MuscleTech",
                "description": "Quemador termogénico potente. Acelera metabolismo y aumenta energía.",
                "nutritional_value": "Por porción (2 caps): 200mg cafeína, extracto de té verde, yohimbina",
                "price": Decimal("599.00"),
                "stock": 35,
                "physical_activities": ["Cardio", "HIIT", "Running"],
                "fitness_objectives": ["Pérdida de peso", "Definición"],
                "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
            },
            {
                "name": "L-Carnitine Liquid 3000mg",
                "brand": "Nutrex",
                "description": "L-Carnitina líquida para transporte de grasas. Sin estimulantes.",
                "nutritional_value": "Por porción (15ml): 3000mg L-Carnitina, 0mg cafeína",
                "price": Decimal("449.00"),
                "stock": 40,
                "physical_activities": ["Cardio", "Running", "Ciclismo"],
                "fitness_objectives": ["Pérdida de peso", "Energía"],
                "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
            },
            {
                "name": "CLA Softgels 180 caps",
                "brand": "Evlution Nutrition",
                "description": "Ácido linoleico conjugado para definición muscular y metabolismo de grasas.",
                "nutritional_value": "Por porción (3 caps): 3000mg CLA",
                "price": Decimal("499.00"),
                "stock": 50,
                "physical_activities": ["Gym", "Cardio"],
                "fitness_objectives": ["Definición", "Pérdida de peso"],
                "image_url": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
            },
            {
                "name": "Thermogenic Fat Burner 60 caps",
                "brand": "Evogen",
                "description": "Quemador termogénico premium con múltiples extractos vegetales.",
                "nutritional_value": "Por porción (2 caps): 225mg cafeína, té verde, cayena, yohimbina",
                "price": Decimal("649.00"),
                "stock": 25,
                "physical_activities": ["HIIT", "CrossFit", "Cardio"],
                "fitness_objectives": ["Pérdida de peso", "Energía"],
                "image_url": "https://images.unsplash.com/photo-1607113241473-b2f8e44c09a6?w=400"
            }
        ],
        "Aminoácidos": [
            {
                "name": "BCAA 5000 Powder 60 servicios",
                "brand": "Optimum Nutrition",
                "description": "BCAAs en polvo con ratio 2:1:1. Previene catabolismo muscular durante el entreno.",
                "nutritional_value": "Por porción (9g): 5g BCAAs (2.5g leucina, 1.25g isoleucina, 1.25g valina)",
                "price": Decimal("549.00"),
                "stock": 45,
                "physical_activities": ["Gym", "CrossFit", "Running"],
                "fitness_objectives": ["Recuperación", "Ganar músculo"],
                "image_url": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400"
            },
            {
                "name": "EAA Complete Essential Aminos",
                "brand": "Evlution Nutrition",
                "description": "Los 9 aminoácidos esenciales. Superior a BCAAs para síntesis proteica.",
                "nutritional_value": "Por porción (10g): 8g EAAs, incluye 5.5g BCAAs",
                "price": Decimal("649.00"),
                "stock": 30,
                "physical_activities": ["Gym", "Bodybuilding", "CrossFit"],
                "fitness_objectives": ["Ganar músculo", "Recuperación"],
                "image_url": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"
            },
            {
                "name": "Glutamine Powder 1000g",
                "brand": "MuscleTech",
                "description": "L-Glutamina pura. Mejora recuperación y sistema inmune.",
                "nutritional_value": "Por porción (5g): 5g L-Glutamina",
                "price": Decimal("499.00"),
                "stock": 35,
                "physical_activities": ["Gym", "CrossFit", "Running"],
                "fitness_objectives": ["Recuperación", "Salud general"],
                "image_url": "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400"
            },
            {
                "name": "Beta-Alanine 200g",
                "brand": "Now Sports",
                "description": "Beta-alanina pura para aumentar resistencia muscular y retrasar fatiga.",
                "nutritional_value": "Por porción (2g): 2g Beta-Alanina",
                "price": Decimal("349.00"),
                "stock": 40,
                "physical_activities": ["CrossFit", "HIIT", "Running"],
                "fitness_objectives": ["Resistencia", "Rendimiento"],
                "image_url": "https://images.unsplash.com/photo-1608138969275-fbc7748f39e3?w=400"
            }
        ]
    }

    product_count = 0
    for category, products in categories.items():
        print(f"\n  📦 Categoría: {category}")
        for product_data in products:
            # Extraer URL de imagen
            image_url = product_data.pop("image_url")

            # Verificar si ya existe
            existing = db.query(Product).filter_by(name=product_data["name"]).first()
            if not existing:
                # Crear producto
                product = Product(
                    category=category,
                    **product_data
                )
                db.add(product)
                db.flush()  # Para obtener el product_id

                # Crear imagen del producto
                product_image = ProductImage(
                    product_id=product.product_id,
                    image_path=image_url,
                    is_primary=True
                )
                db.add(product_image)

                product_count += 1
                print(f"    ✓ {product_data['name']} - ${product_data['price']}")
            else:
                print(f"    ⊙ {product_data['name']} ya existe")

    db.commit()
    print(f"\n✅ {product_count} productos creados\n")


def main():
    """Función principal"""
    print("=" * 70)
    print("🚀 SEED DATA - Poblando Base de Datos RDS")
    print("=" * 70)
    print()

    db = SessionLocal()

    try:
        # 1. Crear Loyalty Tiers
        create_loyalty_tiers(db)

        # 2. Crear Cupones
        create_coupons(db)

        # 3. Crear Productos
        create_products(db)

        print("=" * 70)
        print("✅ PROCESO COMPLETADO EXITOSAMENTE")
        print("=" * 70)
        print()
        print("📊 Resumen:")

        # Contar registros
        tier_count = db.query(LoyaltyTier).count()
        coupon_count = db.query(Coupon).count()
        product_count = db.query(Product).count()

        print(f"  • Loyalty Tiers: {tier_count}")
        print(f"  • Cupones: {coupon_count}")
        print(f"  • Productos: {product_count}")
        print()
        print("🎯 Próximos pasos:")
        print("  1. Inicia el servidor: uvicorn app.main:app --reload")
        print("  2. Prueba los endpoints en: http://localhost:8000/docs")
        print("  3. Revisa pgAdmin4 para ver los datos")
        print()

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
