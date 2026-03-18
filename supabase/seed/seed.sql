insert into public.companies (id, name, legal_name, tax_id)
values ('11111111-1111-1111-1111-111111111111', 'Operações Sabesp', 'Operações Sabesp LTDA', '00.000.000/0001-00')
on conflict do nothing;

insert into public.service_types (company_id, key, label)
values
('11111111-1111-1111-1111-111111111111', 'ligacao', 'Ligação de água'),
('11111111-1111-1111-1111-111111111111', 'religacao', 'Religação de água'),
('11111111-1111-1111-1111-111111111111', 'corte', 'Corte/Suspensão'),
('11111111-1111-1111-1111-111111111111', 'cobranca', 'Cobrança'),
('11111111-1111-1111-1111-111111111111', 'outro', 'Outro serviço')
on conflict do nothing;

insert into public.motoboys (company_id, name, cpf, phone, email, plate, bike_model, status, region)
values
('11111111-1111-1111-1111-111111111111', 'Carlos Silva', '12345678901', '11999990001', 'carlos@ops.local', 'ABC1D23', 'CG 160', 'ativo', 'Zona Sul'),
('11111111-1111-1111-1111-111111111111', 'Mariana Souza', '12345678902', '11999990002', 'mariana@ops.local', 'DEF4G56', 'Factor 150', 'ativo', 'Zona Leste')
on conflict do nothing;
