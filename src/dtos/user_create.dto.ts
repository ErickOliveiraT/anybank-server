import { IsNotEmpty,
    Length,
    IsBoolean,
    IsEmail,
    IsDateString,
    IsIn,
    IsOptional,
    IsNumber,
    IsNumberString,
    Matches
} from 'class-validator';

export class UserCreateDTO {
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    nickname: string;

    @IsNotEmpty()
    @Length(11, 11)
    cpf: string;

    @Matches(/^\+55\d{2}\d{8,9}$/)
    phone: string;

    @IsBoolean()
    phone_whatsapp: boolean;

    @IsEmail()
    email: string;

    @IsDateString()
    birthdate: string;

    @IsIn(["cnh", "rg"])
    document_type: string;

    @IsNotEmpty()
    document_value: string;

    @IsOptional()
    @IsDateString()
    document_expedition_date?: string;

    @IsOptional()
    @IsNotEmpty()
    document_expedition_org?: string

    @IsNotEmpty()
    mother_name: string;

    @IsNotEmpty()
    father_name: string;

    @IsIn(["single", "married", "divorced", "widower"])
    marital_status: string;

    @IsOptional()
    @IsIn(["partial", "total", "separated"])
    marital_type: string;

    @IsNotEmpty()
    birth_country: string;

    @IsNotEmpty()
    birth_state: string;

    @IsNotEmpty()
    birth_city: string;

    @IsNotEmpty()
    address_street: string;

    @IsNotEmpty()
    address_street_number: string;

    @IsNotEmpty()
    address_complement: string;

    @IsNotEmpty()
    address_city: string;

    @IsNotEmpty()
    address_state: string;

    @IsNotEmpty()
    address_country: string;

    @IsNotEmpty()
    address_postal_code: string;

    @IsNumber()
    monthly_income: number;

    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    password: string;
}