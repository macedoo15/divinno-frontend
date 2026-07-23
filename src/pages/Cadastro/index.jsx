import { Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  PhoneIcon,
  LockIcon,
  InstagramIcon,
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
        <section className={styles.brandHero}>
          <div className={styles.logoFrame}>
            <Logo size="hero" />
          </div>
          <span className={styles.eyebrow}>Clube Divinno</span>
          <h1 className={styles.title}>Cadastro de cliente</h1>
          <p className={styles.subtitle}>
            Faca parte da lista Divinno e receba novidades, beneficios e convites especiais.
          </p>
        </section>

        <div className={styles.formFields}>
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

        <div className={styles.privacy}>
          <LockIcon className={styles.privacyIcon} />
          <span>Seus dados estao protegidos e nao serao compartilhados.</span>
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <Button type="submit" loading={status === 'submitting'}>
          Cadastrar agora
        </Button>

        <Link className={styles.adminLink} to="/admin/login">
          <LockIcon />
          Area administrativa
        </Link>

        <a
          className={styles.socialLink}
          href="https://www.instagram.com/divinno.cervejaria/"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon />
          @divinno.cervejaria
        </a>
      </form>
    </main>
  );
}

export default Cadastro;
