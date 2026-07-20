import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import Logo from '../../components/Logo';
import ArchDivider from '../../components/ArchDivider';
import StepProgress from '../../components/StepProgress';
import Panel from '../../components/Panel';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  PhoneIcon,
  LockIcon,
  IdCardIcon,
  InfoIcon,
  ShieldIcon,
} from '../../components/icons';
import { useCadastroForm } from '../../hooks/useCadastroForm';
import { maskPhone } from '../../utils/masks';
import CadastroSucesso from './CadastroSucesso';
import styles from './Cadastro.module.css';

function Cadastro() {
  const {
    register,
    control,
    onSubmit,
    formState: { errors },
    status,
    serverError,
    watch,
  } = useCadastroForm();

  if (status === 'success') {
    return (
      <main className={styles.page}>
        <CadastroSucesso nome={watch('nome')} />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <Link className={styles.adminLink} to="/admin/login">
          <ShieldIcon />
          Area administrativa
        </Link>

        <Logo />

        <div className={styles.intro}>
          <span className={styles.eyebrow}>Divinno Cervejaria &amp; Restaurante</span>
          <h1 className={styles.title}>Complete seu cadastro</h1>
          <p className={styles.subtitle}>
            Preencha os dados abaixo para fazer parte do clube Divinno e receber novidades da casa.
          </p>
        </div>

        <StepProgress steps={3} current={0} />

        <Panel icon={<IdCardIcon />} title="Dados pessoais">
          <FormField
            id="nome"
            label="Nome completo"
            icon={<UserIcon />}
            placeholder="Ex: Maria Silva"
            error={errors.nome?.message}
            {...register('nome')}
          />
          <FormField
            id="email"
            label="E-mail"
            icon={<MailIcon />}
            type="email"
            placeholder="Ex: maria@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </Panel>

        <Panel icon={<InfoIcon />} title="Informações adicionais">
          <div className={styles.row}>
            <FormField
              id="dataNascimento"
              label="Data de nascimento"
              icon={<CalendarIcon />}
              type="date"
              error={errors.dataNascimento?.message}
              {...register('dataNascimento')}
            />
            <Controller
              name="whatsapp"
              control={control}
              render={({ field }) => (
                <FormField
                  id="whatsapp"
                  label="WhatsApp"
                  icon={<PhoneIcon />}
                  type="tel"
                  inputMode="numeric"
                  placeholder="(11) 99999-9999"
                  error={errors.whatsapp?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        </Panel>

        <div className={styles.privacy}>
          <LockIcon className={styles.privacyIcon} />
          <span>Seus dados estão protegidos e não serão compartilhados.</span>
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <Button type="submit" loading={status === 'submitting'}>
          Confirmar cadastro
        </Button>

        <ArchDivider flip />
        <a className={styles.socialLink} href="https://instagram.com" target="_blank" rel="noreferrer">
          @divinnocervejaria
        </a>
      </form>
    </main>
  );
}

export default Cadastro;
