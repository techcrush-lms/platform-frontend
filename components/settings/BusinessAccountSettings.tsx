import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BusinessProfile, BusinessProfileFull } from '@/types/org';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Input from '../ui/Input';
import Select from '../Select';
import {
  BUSINESS_INDUSTRIES,
  BUSINESS_SIZES,
  cn,
  COUNTRIES,
  getAvatar,
  OnboardingProcess,
} from '@/lib/utils';
import Joi from 'joi';
import { toast } from 'react-hot-toast';
import {
  saveOrgInfo,
  setOnboardingStep,
  switchToOrg,
  fetchOrgs,
  updateOnboardingProcess,
} from '@/redux/slices/orgSlice';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';
import Avatar from '../ui/Avatar';
import Link from 'next/link';
import OnboardingAlert from '../OnboardingAlert';
import { Textarea } from '../ui/textarea';
import { Globe, X } from 'lucide-react';
import slugify from 'slugify';

enum BusinessAction {
  MODIFY = 'modify',
  SELECT = 'select',
}

const SOCIAL_MEDIA_PLATFORMS = [
  'Select Platform',
  'Facebook',
  'Twitter',
  'Instagram',
  'LinkedIn',
  'Website',
  'Other',
];

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL; // change to your actual base URL

const STATES_BY_COUNTRY: { [key: string]: string[] } = {
  'United States': [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ],
  Canada: [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon',
  ],
  Nigeria: [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'Federal Capital Territory',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ],
  India: [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  Australia: [
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
  ],
  Germany: [
    'Baden-Württemberg',
    'Bavaria',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hesse',
    'Lower Saxony',
    'Mecklenburg-Vorpommern',
    'North Rhine-Westphalia',
    'Rhineland-Palatinate',
    'Saarland',
    'Saxony',
    'Saxony-Anhalt',
    'Schleswig-Holstein',
    'Thuringia',
  ],
  France: [
    'Auvergne-Rhône-Alpes',
    'Bourgogne-Franche-Comté',
    'Bretagne',
    'Centre-Val de Loire',
    'Corse',
    'Grand Est',
    'Hauts-de-France',
    'Île-de-France',
    'Normandie',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Pays de la Loire',
    "Provence-Alpes-Côte d'Azur",
  ],
  Brazil: [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
  ],
  China: [
    'Anhui',
    'Beijing',
    'Chongqing',
    'Fujian',
    'Gansu',
    'Guangdong',
    'Guangxi',
    'Guizhou',
    'Hainan',
    'Hebei',
    'Heilongjiang',
    'Henan',
    'Hubei',
    'Hunan',
    'Inner Mongolia',
    'Jiangsu',
    'Jiangxi',
    'Jilin',
    'Liaoning',
    'Ningxia',
    'Qinghai',
    'Shaanxi',
    'Shandong',
    'Shanghai',
    'Shanxi',
    'Sichuan',
    'Tianjin',
    'Tibet',
    'Xinjiang',
    'Yunnan',
    'Zhejiang',
  ],
  Mexico: [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Coahuila',
    'Colima',
    'Ciudad de México',
    'Durango',
    'Estado de México',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ],
  'South Africa': [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
  ],
  Argentina: [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Ciudad Autónoma de Buenos Aires',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
  ],
  Spain: [
    'Andalucía',
    'Aragón',
    'Asturias',
    'Cantabria',
    'Castilla-La Mancha',
    'Castilla y León',
    'Cataluña',
    'Ceuta',
    'Comunidad de Madrid',
    'Comunidad Foral de Navarra',
    'Comunidad Valenciana',
    'Extremadura',
    'Galicia',
    'Islas Baleares',
    'Islas Canarias',
    'La Rioja',
    'Melilla',
    'País Vasco',
    'Principado de Asturias',
    'Región de Murcia',
  ],
  Italy: [
    'Abruzzo',
    'Basilicata',
    'Calabria',
    'Campania',
    'Emilia-Romagna',
    'Friuli-Venezia Giulia',
    'Lazio',
    'Liguria',
    'Lombardia',
    'Marche',
    'Molise',
    'Piemonte',
    'Puglia',
    'Sardegna',
    'Sicilia',
    'Toscana',
    'Trentino-Alto Adige',
    'Umbria',
    "Valle d'Aosta",
    'Veneto',
  ],
  Japan: [
    'Aichi',
    'Akita',
    'Aomori',
    'Chiba',
    'Ehime',
    'Fukui',
    'Fukuoka',
    'Fukushima',
    'Gifu',
    'Gunma',
    'Hiroshima',
    'Hokkaido',
    'Hyogo',
    'Ibaraki',
    'Ishikawa',
    'Iwate',
    'Kagawa',
    'Kagoshima',
    'Kanagawa',
    'Kochi',
    'Kumamoto',
    'Kyoto',
    'Mie',
    'Miyagi',
    'Miyazaki',
    'Nagano',
    'Nagasaki',
    'Nara',
    'Niigata',
    'Oita',
    'Okayama',
    'Okinawa',
    'Osaka',
    'Saga',
    'Saitama',
    'Shiga',
    'Shimane',
    'Shizuoka',
    'Tochigi',
    'Tokushima',
    'Tokyo',
    'Tottori',
    'Toyama',
    'Wakayama',
    'Yamagata',
    'Yamaguchi',
    'Yamanashi',
  ],
  Kenya: [
    'Baringo',
    'Bomet',
    'Bungoma',
    'Busia',
    'Elgeyo Marakwet',
    'Embu',
    'Garissa',
    'Homa Bay',
    'Isiolo',
    'Kajiado',
    'Kakamega',
    'Kericho',
    'Kiambu',
    'Kilifi',
    'Kirinyaga',
    'Kisii',
    'Kisumu',
    'Kitui',
    'Kwale',
    'Laikipia',
    'Lamu',
    'Machakos',
    'Makueni',
    'Mandera',
    'Marsabit',
    'Meru',
    'Migori',
    'Mombasa',
    "Murang'a",
    'Nairobi',
    'Nakuru',
    'Nandi',
    'Narok',
    'Nyamira',
    'Nyandarua',
    'Nyeri',
    'Samburu',
    'Siaya',
    'Taita Taveta',
    'Tana River',
    'Tharaka Nithi',
    'Trans Nzoia',
    'Turkana',
    'Uasin Gishu',
    'Vihiga',
    'Wajir',
    'West Pokot',
  ],
  Ghana: [
    'Ahafo',
    'Ashanti',
    'Bono',
    'Bono East',
    'Central',
    'Eastern',
    'Greater Accra',
    'North East',
    'Northern',
    'Oti',
    'Savannah',
    'Upper East',
    'Upper West',
    'Volta',
    'Western',
    'Western North',
  ],
  Egypt: [
    'Alexandria',
    'Aswan',
    'Asyut',
    'Beheira',
    'Beni Suef',
    'Cairo',
    'Dakahlia',
    'Damietta',
    'Faiyum',
    'Gharbia',
    'Giza',
    'Ismailia',
    'Kafr El Sheikh',
    'Luxor',
    'Matruh',
    'Minya',
    'Monufia',
    'New Valley',
    'North Sinai',
    'Port Said',
    'Qalyubia',
    'Qena',
    'Red Sea',
    'Sharqia',
    'Sohag',
    'South Sinai',
    'Suez',
  ],
  Morocco: [
    'Agadir-Ida-Ou-Tanane',
    'Al Haouz',
    'Al Hoceima',
    'Assa-Zag',
    'Azilal',
    'Béni Mellal',
    'Béni-Mellal-Khénifra',
    'Berkane',
    'Berrechid',
    'Boujdour',
    'Boulemane',
    'Casablanca-Settat',
    'Chefchaouen',
    'Chichaoua',
    'Dakhla-Oued Ed-Dahab',
    'Drâa-Tafilalet',
    'El Hajeb',
    'El Jadida',
    'Errachidia',
    'Essaouira',
    'Fahs-Anjra',
    'Fès-Meknès',
    'Figuig',
    'Fquih Ben Salah',
    'Guelmim-Oued Noun',
    'Ifrane',
    'Inezgane-Aït Melloul',
    'Jerada',
    'Kénitra',
    'Khemisset',
    'Khenifra',
    'Khouribga',
    'Laâyoune-Sakia El Hamra',
    'Larache',
    'Marrakech-Safi',
    'Médiouna',
    'Meknès',
    'Midelt',
    'Mohammedia',
    'Moulay Yacoub',
    'Nador',
    'Nouaceur',
    'Ouarzazate',
    'Oued Ed-Dahab-Lagouira',
    'Oujda-Angad',
    'Ouezzane',
    'Rabat-Salé-Kénitra',
    'Rehamna',
    'Safi',
    'Salé',
    'Sefrou',
    'Settat',
    'Sidi Bennour',
    'Sidi Ifni',
    'Sidi Kacem',
    'Sidi Slimane',
    'Skhirate-Témara',
    'Tanger-Tétouan-Al Hoceima',
    'Tan-Tan',
    'Taounate',
    'Taourirt',
    'Taroudannt',
    'Tata',
    'Taza',
    'Tétouan',
    'Tiflet',
    'Tinghir',
    'Tiznit',
    'Youssoufia',
    'Zagora',
  ],
};

// Function to get states for a given country
const getStatesForCountry = (country: string): string[] => {
  return STATES_BY_COUNTRY[country] || [];
};

const businessSchema = Joi.object({
  business_name: Joi.string().required().min(2).max(100),
  business_slug: Joi.string().required().min(2).max(36),
  business_description: Joi.string().required().min(2).max(100),
  industry: Joi.string()
    .required()
    .valid(...BUSINESS_INDUSTRIES),
  social_media_handles: Joi.array().items({
    handle: Joi.string().required().min(2).max(100),
    link: Joi.string().required().min(2).max(100),
  }),
  business_size: Joi.string()
    .required()
    .valid(...BUSINESS_SIZES.map((size) => size.toLowerCase())),
  location: Joi.string().required().min(2).max(100),
  state: Joi.string().required().min(2).max(50),
  country: Joi.string().required().min(2).max(50),
  logo_url: Joi.string().uri(),
});

const BusinessAccountSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orgs, org } = useSelector((state: RootState) => state.org);
  const [showAddModal, setShowAddModal] = useState(
    Boolean(orgs.length) ? false : true
  );
  const [selectedOrg, setSelectedOrg] = useState<BusinessProfileFull | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<
      BusinessProfile,
      | 'id'
      | 'business_id'
      | 'user_id'
      | 'onboarding_status'
      | 'is_active'
      | 'is_approved'
      | 'created_at'
      | 'updated_at'
      | 'timeline'
      | 'working_hours'
      | 'country_code'
    > & { social_media_handles: { handle: string; link: string }[] }
  >({
    business_name: '',
    business_description: '',
    industry: '',
    business_slug: '',
    business_size: '',
    location: '',
    state: '',
    country: '',
    social_media_handles: [],
    logo_url: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.business_name.trim() !== '' &&
      formData.business_description.trim() !== '' &&
      formData.industry.trim() !== '' &&
      formData.business_size.trim() !== '' &&
      formData.location.trim() !== '' &&
      (formData.state || '').trim() !== '' &&
      formData.country.trim() !== ''
      // &&
      // formData.logo_url !== ''
    );
  };

  // Update form data when selectedOrg changes
  useEffect(() => {
    if (selectedOrg) {
      setFormData({
        business_name: selectedOrg.business_name || '',
        business_description: selectedOrg.business_description || '',
        business_slug: selectedOrg.business_slug || '',
        industry: selectedOrg.industry || '',
        business_size: selectedOrg.business_size || '',
        location: selectedOrg.location || '',
        state: selectedOrg.state || '',
        country: selectedOrg.country || '',
        logo_url: selectedOrg.logo_url || '',
        social_media_handles: selectedOrg.social_media_handles || [],
      });
      setLogoPreview(selectedOrg.logo_url || null);
      // Set available states for the selected country
      setAvailableStates(getStatesForCountry(selectedOrg.country || ''));
    } else {
      const defaultStates = getStatesForCountry(COUNTRIES[0]);
      setFormData({
        business_name: '',
        business_description: '',
        business_slug: '',
        industry: '',
        business_size: '',
        location: '',
        state: '',
        country: '',
        logo_url: '',
        social_media_handles: [],
      });
      setLogoFile(null);
      setAvailableStates(defaultStates);
    }
  }, [selectedOrg]);

  // Update available states when country changes
  useEffect(() => {
    const states = getStatesForCountry(formData.country || '');
    setAvailableStates(states);
    // Reset state if current state is not available in the new country
    if (states.length > 0 && !states.includes(formData.state || '')) {
      setFormData((prev) => ({ ...prev, state: states[0] }));
    } else if (states.length === 0) {
      setFormData((prev) => ({ ...prev, state: '' }));
    }
  }, [formData.country]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'business_name') {
      setFormData((prev) => ({ ...prev, business_slug: slugify(value) }));
    }
  };

  const handleSocialMediaChange = (
    index: number,
    field: 'handle' | 'link',
    value: string
  ) => {
    setFormData((prev) => {
      const updatedHandles = [...prev.social_media_handles];
      updatedHandles[index] = { ...updatedHandles[index], [field]: value };
      return { ...prev, social_media_handles: updatedHandles };
    });
  };

  const handleAddSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      social_media_handles: [
        ...prev.social_media_handles,
        { handle: '', link: '' },
      ],
    }));
  };

  const handleRemoveSocialMedia = (index: number) => {
    setFormData((prev) => {
      const updatedHandles = [...prev.social_media_handles];
      updatedHandles.splice(index, 1);
      return { ...prev, social_media_handles: updatedHandles };
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts or modal closes
  const cleanupPreview = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  };

  const handleCloseModal = () => {
    cleanupPreview();
    setShowAddModal(false);
    setSelectedOrg(null);
    setLogoFile(null);
  };

  const handleEditOrg = (org: BusinessProfileFull) => {
    setSelectedOrg(org);
    setShowAddModal(true);
  };

  const handleSubmit = async (action: BusinessAction) => {
    try {
      setIsLoading(true);

      if (action === BusinessAction.MODIFY) {
        setIsSaveLoading(true);
      } else if (action === BusinessAction.SELECT) {
        setIsSelectLoading(true);
      }

      let logoUrl = formData.logo_url;

      // Upload logo if a new file is selected
      if (logoFile) {
        const formData = new FormData();
        formData.append('image', logoFile);
        const response = await dispatch(
          uploadImage({ form_data: formData })
        ).unwrap();
        logoUrl = response.multimedia.url;
      }

      // Prepare data for API
      const businessData = {
        ...formData,
        logo_url: logoUrl,
        business_size: formData.business_size.toLowerCase(),
        industry: formData.industry,
      };

      // Validate form data
      const { error } = businessSchema.validate(businessData);
      if (error) {
        toast.error(error.details[0].message);
        return;
      }

      // Save business info
      await dispatch(saveOrgInfo(businessData)).unwrap();

      // Fetch updated organizations
      await dispatch(fetchOrgs({}));

      // If editing, switch to the edited org, otherwise select the first org
      if (selectedOrg) {
        // For editing, we need to find the updated org in the list
        const updatedOrgs = await dispatch(fetchOrgs({})).unwrap();
        const updatedOrg = updatedOrgs.organizations.find(
          (o) => o.business_name === businessData.business_name
        );
        if (updatedOrg) {
          if (
            !org?.onboarding_status.onboard_processes?.includes(
              OnboardingProcess.BUSINESS_DETAILS
            )
          ) {
            await dispatch(
              updateOnboardingProcess({
                business_id: updatedOrg.id,
                process: OnboardingProcess.BUSINESS_DETAILS,
              })
            );
          }
          toast.success('Business account updated successfully');
        }
      } else {
        // For new business, select the first org
        const orgs = await dispatch(fetchOrgs({})).unwrap();

        // Automatically select the newly added business
        dispatch(
          switchToOrg({
            business_id: orgs.organizations[0].id,
            process: OnboardingProcess.BUSINESS_DETAILS,
          })
        );

        // Update onboarding process for new business

        if (
          !org?.onboarding_status.onboard_processes?.includes(
            OnboardingProcess.BUSINESS_DETAILS
          )
        ) {
          await dispatch(
            updateOnboardingProcess({
              business_id: orgs.organizations[0].id,
              process: OnboardingProcess.BUSINESS_DETAILS,
            })
          );
        }

        toast.success('Business account created successfully');
      }

      setShowAddModal(false);
      setSelectedOrg(null);
      const defaultStates = getStatesForCountry(COUNTRIES[0]);
      setFormData({
        business_name: '',
        business_description: '',
        business_slug: '',
        industry: '',
        business_size: '',
        location: '',
        state: '',
        country: '',
        logo_url: '',
        social_media_handles: [],
      });
      setLogoFile(null);
      setAvailableStates(defaultStates);
    } catch (error) {
      toast.error(
        selectedOrg
          ? 'Failed to update business account'
          : 'Failed to create business account'
      );
      console.error('Error saving business account:', error);
    } finally {
      setIsLoading(false);
      if (action === BusinessAction.MODIFY) {
        setIsSaveLoading(false);
      } else if (action === BusinessAction.SELECT) {
        setIsSelectLoading(false);
      }
    }
  };

  return (
    <Card className='dark:border-gray-600 text-black-1 dark:text-white'>
      <CardHeader>
        <div className='flex flex-col md:flex-row gap-2 md:justify-between items-start md:items-center'>
          <CardTitle>Business Accounts</CardTitle>
          {orgs.length > 0 && (
            <Button
              variant='primary'
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2'
            >
              <FiPlus className='w-4 h-4' />
              Add Business Account
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {orgs.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
              <FiBriefcase className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium mb-2'>No Business Accounts</h3>
            <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-sm'>
              Get started by creating your first business account. This will
              help you manage your business operations.
            </p>
            <Button
              variant='primary'
              onClick={() => setShowAddModal(true)}
              className='flex items-center gap-2'
            >
              <FiPlus className='w-4 h-4' />
              Create Business Account
            </Button>
          </div>
        ) : (
          <>
            {/* Business Accounts List */}
            <div className='grid gap-4'>
              {orgs.map((orgItem) => (
                <div
                  key={orgItem.id}
                  className={`p-4 rounded-lg border ${
                    orgItem.id === org?.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    <div className='flex items-start gap-4'>
                      {orgItem.logo_url ? (
                        <Avatar
                          src={orgItem.logo_url}
                          alt={orgItem.business_name}
                          size='xl'
                        />
                      ) : (
                        <Avatar
                          src={getAvatar(
                            orgItem.logo_url,
                            orgItem.business_name
                          )}
                          alt={orgItem?.business_name}
                          size='xl'
                        />
                      )}
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-medium text-lg'>
                            {orgItem.business_name}
                          </h3>
                          {orgItem.id === org?.id && (
                            <span className='px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 font-medium'>
                              Current
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                          {orgItem.industry}
                        </p>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          <span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                            {orgItem.business_size}
                          </span>
                          <span className='px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'>
                            {orgItem.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2 sm:flex-shrink-0'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditOrg(orgItem)}
                        className='flex items-center gap-1'
                      >
                        <FiEdit2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showAddModal || !!selectedOrg}
          onClose={handleCloseModal}
          title={selectedOrg ? 'Edit Business Account' : 'Add Business Account'}
          className='m-2 dark:text-gray-400 text-gray-800'
        >
          {/* X Close Button */}
          <button
            onClick={handleCloseModal}
            className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Name
              </label>
              <Input
                type='text'
                name='business_name'
                placeholder='Enter business name'
                value={formData.business_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Store Page
              </label>
              <div className='relative'>
                <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  type='text'
                  name='business_slug'
                  placeholder='Enter business store page'
                  value={formData.business_slug}
                  onChange={handleInputChange}
                  required
                  className='pl-9'
                />
              </div>

              {/* Live preview */}
              {formData.business_slug && (
                <p className='mt-2 text-sm '>
                  Preview:{' '}
                  <span className='text-primary-main dark:text-primary-faded font-medium'>
                    {baseUrl}/b/{formData.business_slug}
                  </span>
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Description
              </label>
              <Textarea
                rows={3}
                name='business_description'
                placeholder='Enter business description'
                value={formData.business_description}
                onChange={handleInputChange as any}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Industry</label>
              <Select
                name='industry'
                className='w-full'
                data={BUSINESS_INDUSTRIES}
                value={formData.industry}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    industry:
                      e.target.value === BUSINESS_INDUSTRIES[0]
                        ? ''
                        : e.target.value,
                  })
                }
                defaultValue='Select Industry'
                required
                placeholder='Select Industry'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Business Size
              </label>
              <Select
                name='business_size'
                className='w-full'
                data={BUSINESS_SIZES}
                value={formData.business_size}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    business_size:
                      e.target.value === BUSINESS_SIZES[0]
                        ? ''
                        : e.target.value,
                  })
                }
                defaultValue='Select Business Size'
                required
                placeholder='Select Business Size'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Country</label>
              <Select
                name='country'
                className='w-full'
                data={COUNTRIES}
                value={formData.country}
                onChange={(e: any) =>
                  setFormData({
                    ...formData,
                    country:
                      e.target.value === COUNTRIES[0] ? '' : e.target.value,
                  })
                }
                defaultValue='Select Country'
                required
                placeholder='Select Country'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                State/Province
              </label>
              {availableStates.length > 0 ? (
                <Select
                  name='state'
                  className='w-full'
                  data={availableStates}
                  value={formData.state || ''}
                  onChange={(e: any) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                  defaultValue=''
                  required
                  placeholder='Select State/Province'
                />
              ) : (
                <Input
                  type='text'
                  name='state'
                  placeholder='Enter state/province'
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Location</label>
              <Input
                type='text'
                name='location'
                placeholder='Enter business location'
                value={formData.location || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Logo</label>
              <div className='space-y-2'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleLogoChange}
                  className='block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-main file:text-white
                    hover:file:bg-primary-main/90
                    dark:file:bg-primary-main dark:file:text-white'
                  required
                />
                {(logoPreview || selectedOrg?.logo_url) && (
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                      Preview:
                    </p>
                    <div className='relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                      <img
                        src={logoPreview || selectedOrg?.logo_url}
                        alt='Logo preview'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Social Media Handles
              </label>
              <div className='space-y-3'>
                {formData.social_media_handles.map((handle, index) => (
                  <>
                    <div key={index} className='flex gap-2 items-center'>
                      <Select
                        name={`social_media_handle_${index}`}
                        className='w-1/2'
                        data={SOCIAL_MEDIA_PLATFORMS}
                        value={handle.handle}
                        onChange={(e: any) =>
                          handleSocialMediaChange(
                            index,
                            'handle',
                            e.target.value
                          )
                        }
                        defaultValue='Select Platform'
                        placeholder='Select Platform'
                      />
                      <Input
                        type='text'
                        name={`social_media_link_${index}`}
                        placeholder={`Link text`}
                        value={handle.link}
                        onChange={(e) =>
                          handleSocialMediaChange(index, 'link', e.target.value)
                        }
                        required
                      />

                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleRemoveSocialMedia(index)}
                        className='flex-shrink-0'
                      >
                        <FiTrash2 className='w-4 h-4' />
                      </Button>
                    </div>
                    <small>
                      Please include only the ending part of your social media
                      handle.
                    </small>
                  </>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleAddSocialMedia}
                  className='flex items-center gap-2 mt-2'
                >
                  <FiPlus className='w-4 h-4' />
                  Add Social Media Handle
                </Button>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-6 gap-3'>
            <Button
              variant='outline'
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <div className='flex gap-3'>
              {selectedOrg && org?.id !== selectedOrg?.id && (
                <Button
                  variant='primary'
                  onClick={() => handleSubmit(BusinessAction.SELECT)}
                  disabled={isLoading}
                >
                  {isSelectLoading ? (
                    <div className='flex items-center gap-2'>
                      <LoadingIcon />
                      Processing...
                    </div>
                  ) : (
                    'Select'
                  )}
                </Button>
              )}
              <Button
                variant={selectedOrg ? 'green' : 'primary'}
                onClick={() => handleSubmit(BusinessAction.MODIFY)}
                disabled={isLoading || !isFormValid()}
              >
                {isSaveLoading ? (
                  <div className='flex items-center gap-2'>
                    <LoadingIcon />
                    Processing...
                  </div>
                ) : selectedOrg ? (
                  'Save'
                ) : (
                  'Add Business'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default BusinessAccountSettings;
